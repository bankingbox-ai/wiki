---
sidebar_position: 1
---

# npm install -D @lendaas/dev

Soy nuevo y quiero empezar a incrementar. Qué hago?

## Contexto

En Lendaas cada desarrollador tendrá su propio un ambiente homologado e independiente que le permita levantar todas sus dependencias desde la nube, en la modalidad de _infrastructure as a code_. Para esto, decidimos crear una cuenta madre en AWS ([ver cómo](../how-did-we/aws-account.md)) y desde ahí crear cuentas "hijos" para cada desarrollador.

## 1. Crear mi ambiente de desarrollo

:::tip Resultado esperado
Cada desarrollador debe tener credenciales de 3 cuentas de AWS
:::

### A. Usuario en AWS Lendaas PROD

Debes contactar a @alguien que ya tenga sus credenciales para que te cree como usuario IAM en la cuenta principal de Lendaas. Para eso, asegúrate que esa persona siga estas instrucciones:

- inicia sesión ([URL](https://console.aws.amazon.com/console/home))
- __IAM user__ (no Root user)
- __Alias de cuenta__: lendaas
- Una vez iniciada la sesión, ir al servicio __IAM__
- Crear usuario:
  - Nombre de usuario: __inicial del nombre__ y __apellido__ (Ej: Juan Perez => jperez)
  - Activar acceso vía _access key_
  - Generar password automáticamente
  - Agregar al grupo _Administrator Access_
  - Crear

Debiera enviarte un archivo `.csv` con los detalles.

### B. Correo @lendaas.com

Ahora inicia sesión con las credenciales que acabas de recibir.

Una vez que entres debes:

- Buscar __workmail__ en el buscador
- Deberías ver una organización llamada Lendaas. Entra
- Buscar __users__ en el side bar
- Crear nuevo usuario:
  - Patrón de nombres de usuario: puedes usar tu nombre o nick (si ya existe, lo lamento)
  - Crea tu contraseña
- Loggeate en el siguiente [link](https://webmail.mail.us-east-1.awsapps.com/workmail/?organization=lendaas)

### C. Cuenta de AWS personal dentro de la cuenta Lendaas PROD

- en el buscador, buscar organizaciones (__aws organizations__)
- Anda a __Invitations__ (sidebar)
- Nueva invitación (__Invite AWS account__)
- Crear cuenta (__Create an AWS account__)
- Account Name: nombre y apellido
- Email: tu correo @lendaas.com
- Nombre de rol de IAM, dejarlo como está
- sin etiquetas

#### Habilitar cuenta y creación de contraseña

- Ahora debieras recibir un correo en tu mail @lendaas
- El título del correo es "Your AWS Account is Ready - Get started now".
- En caso de que no llegue el correo: borrar y volver a crear
- Tras seguir link del correo. Ingresa como __root user__ usando tu correo @lendaas y selecciona reestablecer password (__forgot password__)
- Después de muchos captchas, recibirás un nuevo correo en tu mail @lendaas que te permitirá crear una contraseña e iniciar sesión

#### Crear usuario IAM

- Una vez dentro de tu cuenta
- Anda al servicio __IAM__
- Arriba a al derecha encontrarás un link para crear un alias. Recomendamos usar el patrón `${nombre}-lendaas` (Ej. `benja-lendaas`)
- Crear grupo con acceso de administrador
  - Grupos, crear nuevo
  - Nombre: administrator-access
  - No hay usuarios para asignar todavía
  - Policies: filtra `AdministratorAccess` usando el buscador
  - Crear
- Crear usuario
  - Usuarios, crear nuevo
  - Nombre: tu nombre (Ej: benja)
  - Asíganalo al grupo administrator-access que creaste en el paso anterior
  - Crear
  - Descarga `.csv` con los detalles de acceso
- Cerrar sesión

:::tip Recapitulando

Si llegaste hasta aquí y realmente seguiste los pasos, deberías tener cuatro cuentas nuevas:

1. __Usuario IAM de la cuenta de AWS Lendaas PROD__: lo usaremos para monitorear prod, evitaremos a toda costa customizar la configuración a través de la interfaz.
2. __Cuenta de correo electrónico @lendaas.com__
3. __Usuario root de tu cuenta AWS personal__: guarda la contraseña en un lugar seguro, solo será necesaria en caso de emergencia.
4. __Usuario IAM de tu cuenta de AWS personal__: de uso cotidiano, podrás desarrollar usando tu propia nube. Esta cuenta también será que que usará nuestro CI para desplegar la infraestructura pre-productiva. Usaremos tu cuenta como entorno para las pruebas.

:::

## 2. Guarda tus claves con KeePassXC

- Se recomienda para administrar todas las credenciales hastas acá creeadas
  - `sudo dnf install keepassxc` (fedora)
  - `sudo apt-get install keepassxc` (ubuntu)
  - [Link para Windows](https://keepassxc.org/download/#windows)
  - [Link para Mac](https://keepassxc.org/download/#mac)
- Dar nombre de la BD local y una descripción. Luego introducir contraseña maestra.
- Con el símbolo más se pueden agregar nuevos passwords a ser guardados.
- Se puede instalar keepassxc browser en el navegador: [Link de la extensión](https://chrome.google.com/webstore/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk?brand=CHBD&gclid=CjwKCAiAjs2bBhACEiwALTBWZfq7AAUsSdiFiQPwG9TS3YQONEXg1c6gxkVJg7p700SzlwSOo0SsxRoCtTwQAvD_BwE&gclsrc=aw.ds).
- Seguir las indicaciones del plugin para la correcta integración con el browser.

## 3. Cuenta en GitHub

### Si ya tienes una cuenta en GitHub

Agrega tu correo de Lendaas a esa cuenta:

- Inicia sesión
- Arriba a la derecha, Preferences
- Email
- Agrega tu correo de Lendaas
- Anda a tu correo y valida el cambio

### Si no tienes una cuenta en GitHub

La crearás al momento de aceptar la invitación.

### Invitación a la organización

Inicia sesión en GitHub con la cuenta infra@lendaas.com, anda a la organización, en la sección _People_ invita a tu correo de lendaas como owner.

Cierra sesión, abre el correo, acepta la invitación y sigue los pasos.

## 4. Conexión via SSH

### Crear llave SSH

Vas a la carpeta de ssh

``` bash
cd ~/.ssh
```

Crear nueva pareja de llaves `ssh`

```bash
ssh-keygen -t rsa -C "<usuario>@lendaas.com" -f id_rsa_lendaas
```

Revisa que se hayan creado bien. Deberían aparecer dos archivos: `id_rsa_lendaas` y `id_rsa_lendaas.pub`.

``` bash
ls -lh ~/.ssh
```

Ahora revisamos que hayan quedado bien configuradas. Debieran aparecer todas tus llaves, incluida la recién creada.

``` bash
ssh-add -L
```

Si no aparece, agrégala.

``` bash
ssh-add id_rsa_lendaas
```

### Agrega la llave a GitHub

En tu cuenta de GitHub: `Settings > SSH keys`. Agrega una nueva.

:::tip

- Puedes ponerle el nombre que quieras
- Copia la llave pública que creaste (`cat id_rsa_lendaas.pub`) y pégala en la interfaz

:::

### Revisa si funcionó

``` bash
ssh -T git@github.com -i ~/.ssh/${LLAVE}
```

Si salió todo bien, deberías ver algo así:

``` text
Hi benja-lendaas! You've successfully authenticated, but GitHub does not provide shell access.
```

## 5. Configuración de git

En tu carpeta `home` (`cd ~`) crea el archivo `.gitconfig`.

``` bash
touch .gitconfig
```

Aquí vive la configuración global de git de tu equipo. En este caso, voy a dejar mi configuración personal por defecto y, además, le diré a `git` que busque un archivo de configuración personalizada para las carpetas `creditu` y `lendaas`.

``` text
[user]
    email = default@email.com
    name = Default Name
    eol = lf
    autocrlf = false

[includeIf "gitdir:~/creditu/"]
    path = ~/creditu/.gitconfig

[includeIf "gitdir:~/lendaas/"]
    path = ~/lendaas/.gitconfig

```

Puedes crear tu configuración global, pero además personalizar la configuración de git para directorios específicos. Tienes la opción de indicarle la ruta de la configuración para ese directorio o puedes incluirla ahí, directamente.

``` bash
cd ~/lendaas
touch .gitconfig
```

La configuración para lendaas sería algo así:

``` text
# cat ~/lendaas/.gitconfig
[user]
    name = Benjamín roa
    email = benja@lendaas.com
[core]
    sshCommand = ssh -i ~/.ssh/${LLAVE_SSH_CREADA_PARA_GIT_LENDAAS}
```

Con `sshCommand` le estamos indicando a git que utilice una llave específica dentro de esta carpeta.

Ahora deberías poder clonar repositorios de GitHub usando ssh.

Esto también se podría conseguir con estrategias como la que aparece
en [este artículo](https://code.tutsplus.com/tutorials/quick-tip-how-to-work-with-github-and-multiple-accounts--net-22574).
Probamos ambas, funcionan. Pero nos pareció más limpia la que proponemos en esta guía. Recomendada.

## 6. CircleCI

Inicia sesión a GitHub con la cuenta de infra@lendaas.com. Ahora entra a [CircleCi](https://circleci.com/) y accede a la organización Lendaas.

En el sidebar, entra a __Organization Settings__ > __Contexts__.

Los [_contextos_](https://circleci.com/docs/contexts/), como define CircleCI, son un mecanismo para manejar variables de entorno de forma segura.

Agregaremos en el contexto _Vault Devs AWS Accounts_ las llaves de acceso de tu usuario IAM de tu cuenta personal. Es MUY importante que no usemos los de lendaas PROD.

### Paso a paso

- Ten a mano el `.csv` que descargaste de AWS la cuenta IAM en tu cuenta personal
- Entra al contexto _Vault Devs AWS Accounts_
- Agrega una nueva variable de entorno
- nombre: ${nombre de tu cuenta de correo}_AWS_ACCESS_KEY_ID (ej: `armando_AWS_ACCESS_KEY_ID`)
- valor: pega aquí la AWS ACCESS KEY ID desde el `.csv`
- Agrega otra nueva llave
- nombre: ${nombre de tu cuenta de correo}_AWS_SECRET_ACCESS_KEY (ej: `armando_AWS_SECRET_ACCESS_KEY`)
- valor: pega aquí el AWS SECRET ACCESS KEY desde el `.csv`

### Verificar que funcionó

- Ahora empuja algún cambio en algún repositorio que tenga integración continua
- Anda al Dashboard de CircleCI, debiera haber un nuevo pipeline en ejecución
- En ese pipeline, luego de los test estáticos, debiera comenzar a desplegarse infraestructura
- En el _job_ "deploy-pre-prod" y el _step_ "deploy stack", en las primeras líneas debieras poder corroborar que tu commit venía con el correo correcto (tienes que empujar en el repositorio usando tu correo @lendaas.com) y que CircleCI cargó correctamente las credenciales.

Verás algo así:

``` text
User email: tono@lendaas.com
GIT_USER_AWS_ACCESS_KEY_ID: tono_AWS_ACCESS_KEY_ID
GIT_USER_AWS_SECRET_ACCESS_KEY: tono_AWS_SECRET_ACCESS_KEY
AWS Credentials successfully set
```

- Abre tu cuenta personal de AWS con tu usuario IAM
- Anda al servicio Cloudformation
- Debiera ver un nuevo stack en proceso de creación
- Si no lo ves, algo salió mal. Revisa la configuración o pide ayuda
