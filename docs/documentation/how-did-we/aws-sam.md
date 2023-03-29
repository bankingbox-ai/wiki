# AWS SAM

## Template

### Outputs

Cuando desplegamos nuestro repositorio SAM, se generarán recursos y valores a los que necesitamos poder acceder después; por ejemplo, la URI de la API Gateway desplegada.
Para poder rescatar estos valores, debemos declararlos en la sección [`Outputs`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html) del `template.yml` de SAM.

```yml
(...)
Outputs:
  WebEndpoint: # Para obtener endpoint API Gateway
    Description: "Api Gateway endpoint URL for Prod stage"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"
  S3Bucket: # Para obtener nombre de bucket S3
    Description: "S3 Bucket for static website content"
    Value: !Ref S3Bucket
  CloudfrontDistribution: # Para obtener distribution de Cloudfront
    Description: "Cloudfront distribution for serverless website"
    Value: !Ref CloudfrontDistribution
```

Los valores pueden ser rescatados con `aws cloudformation describe-stacks --stack-name  NOMBRE_DEL_STACK > stack.json`.

## Redirigiendo página sin www a página con www

Creamos un bucket S3 llamado `lendaas.com-no-www`.
Se le activó la opción de *Static website hosting*, y se configuró para que hosteara una dirección web estática, con documento index `index.html`
El archivo `index.html` debe tener un redirect de la siguiente forma:

```html
<!DOCTYPE html>
<html>
<body>
<script>
    window.location.replace("https://www.lendaas.com/");
</script>
</body>
</html>
```

Adicionalmente se creó una nueva zona de distribución en *CloudFront* con un dominio alternativo `lendaas.com` y apuntando al bucket recién creado.
