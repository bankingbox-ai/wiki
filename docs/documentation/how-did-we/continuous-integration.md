# Configurar la CI/CD

Circle CI + PoC de otras alternativas

## CircleCI

[CircleCI](https://circleci.com/) es una plataforma de CI/CD de fácil configuración. La configuración se guarda en un archivo `.circleci/config.yml`.

### Conectar un nuevo repositorio

1. Conectarse a CircleCI con la cuenta `infra@lendaas.com`
1. En el menú *Projects*, buscar el repositorio a conectar, y clickear en el botón *Set Up Project*.
    - Si ya existe un archivo `.circleci/config.yml`, elegir la opción *Fastest*. Sino, elegir la opción *Faster*.

### Configurar CircleCI Contexts

En CircleCI, podemos guardar secretos o parametros en un contexto dentro del menú `Organization Settings`.

Para poder levantar los ambientes de test en el ambiente de cada desarrollador, configuramos un contexto llamado `Vault Devs AWS Accounts`.

Cada desarrollador configura las  credenciales de su cuenta AWS Lendaas personal con los siguientes parametros:

Cómo sufijo para los parametros de credenciales, incluir la parte de la izquierda del correo electronico. ej: benja para benja@lendaas.com adicionando un _ (guión bajo)

- `benja`_AWS_ACCESS_KEY_ID --> aws_acces_key de su cuenta personal de AWS Lendaas
- `benja`_AWS_SECRET_ACCESS_KEY --> aws_secret_acces_key de su cuenta personal de AWS Lendaas

### Cómo ejecutar sam deploy

1. Se siguió esta [guía](https://circleci.com/developer/orbs/orb/circleci/aws-sam-serverless)
1. copiar el siguiente código en sección workflow de `.circleci/config.yml`:

```yaml
- sam/deploy:
    context: AWS LendAAS Guillaume
    name: deploy-staging
    s3-bucket: aws-sam-cli-managed-default-samclisourcebucket-1s9opp4i2250y
    stack-name: staging-stack
    template: ./template.yaml
```

1. Rescatar el endpoint del output para los siguientes pasos.
2. En el menú *Projects*, buscar el repositorio a conectar, y clicar en el botón *Set Up Project*.
    - Si ya existe un archivo `.circleci/config.yml`, elegir la opción *Fastest*. Si no, elegir la opción *Faster*.

### Estructura del archivo de configuración

`.circleci/config.yml`

Ejemplo de archivo de configuración de CircleCI para un proyecto TypeScript:

```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: circleci/node:16.17.0
    steps:
      - run: npm install
      - run: npm run build
workflows:
  build-app:
    jobs:
      - build
```

Step para obtener el endpoint de la API de un deploy de SAM:

```yaml
      - run:
          name: get-api-gateway-url
          # echo 'export MY_ENV_VAR="FOO"' >> "$BASH_ENV"
          command: |
            export STACK_NAME=staging-stack
            aws apigateway get-rest-apis > api-list.json
            API_ID=$(cat api-list.json | jq -r ".[][] | select (.name == \"$STACK_NAME\").id")
            export API_ID
            export API_GET_URL=https://"$API_ID".execute-api.us-east-1.amazonaws.com/Prod
```

Persistir archivos entre jobs:

```yaml
      - persist_to_workspace:
          root: .
          paths:
            - .build
```

Restaurar archivos entre jobs:

```yaml
      - attach_workspace:
          at: .
```

### Correr los test de integración

Ya que queremos que cada deploy se haga en su propio ambiente de ejecución, y el orbe que estábamos usando de SAM no permite usar la opción `--resolve-s3`, resolvimos realizar manualmente el paso de despliegue.

```yaml
  deploy-sam:
    docker:
      - image: public.ecr.aws/g9w2x9j3/nodejs16-awscli:latest
    steps:
      - checkout
      - run: |
          cat $BASH_ENV
          echo $AWS_ACCESS_KEY_ID
          sam build \
            --template template.yaml \
            --region us-east-1
          sam package \
            --resolve-s3 \
            --region us-east-1
          sam deploy \
            --stack-name << pipeline.parameters.stack-name >> \
            --resolve-s3 \
            --capabilities CAPABILITY_IAM \
            --region us-east-1
```

Al final de correr los test de integración destruimos el stack sin importar que pase o no el test.
En el yaml aumentamos el siguiente step:

```yaml
  functional-test:
     docker:
        - image: public.ecr.aws/g9w2x9j3/nodejs16-awscli:latest
     steps:
        - checkout
        - attach_workspace:
             at: .
        - run:
             name: integration-tests
             command: |
                source .env
                echo ${API_GATEWAY_URL}
                npm ci
                npm run test:functional
        - run:
             when: always
             command: |
                aws cloudformation delete-stack --stack-name staging-stack
```

### Ejecutar workflow al empujar tags

Es deseable poder ejecutar ciertos workflows al empujar tags, por ejemplo, para desplegar en producción.
Para hacer esto, nos guiamos según [estos](https://discuss.circleci.com/t/workflow-job-with-tag-filter-being-run-for-every-commit/20762) [posts](https://discuss.circleci.com/t/workflow-is-not-triggered-by-tag-push-on-github/34421).
La indicación que se da en ellos es agregar los siguientes filtros a la ejecución de los jobs:

```yml
...  
deploy-production:
    jobs:
      - production_build:
          filters:
            branches:
              ignore: /.*/
            tags:
              only: /^v[0-9]+(\.[0-9]+)*$/
...
```

Sin embargo, este approach no nos ha dado buenos resultados.
Los filtros se comportan como OR lógicos, y por defecto los jobs se gatillan en todas las ramas.
Esto provoca que, sin el filtro `branches`, el pipeline se gatille dos veces si pusheamos el tag: una por el commit y otra por el tag.
El filtro `branches` pretende evitar que el pipeline se gatille con los push, pero en nuestro caso impide que el pipeline se ejecute del todo.

Finalmente, la solución fue (insertar solución).
