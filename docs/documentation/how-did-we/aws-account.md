---
sidebar_position: 1
---

# Crear el stack en AWS

Organización, cuentas, cloud9, dominios, pipelines + SAM y email

## Crear organización

> Realizado el `16/08/2014` by @srlapiz, @thomas, @galax, @julio

### 1st step - Representante

- Creamos cuenta con correo de Julio: jcastillo@creditu.com
- AWS account name: `Lendaas`
- Contraseña
- Organization name: `Lendaas`
- Pusimos la tarjeta de Julio, el invita :)
- Pero después la cambiamos, ya no invita (ahora David invita)
- Support plan elegido: `Basic`

### 2nd step - Creación de grupo en IAM

- Creamos un user group con full-access en IAM dashboard
- User group name: `AdministratorAccess`
- Attached policy: `administrator access`

### 3rd step - Creación de usuarios

Ahora creamos los usuarios:

- broa, cgalaz, jrodriguez, cgalaz, broa, jcastillo
- Agregamos tags con Key: Team
- Creamos los usuarios
- Bajamos el csv de usuarios:

- Agregamos el usuario para Billing, facturas@creditu.com. Se agrega la TDC Creditu para el cobro de los servicios AWS

### Crear un alias para la cuenta

- IAM
- Dashboard > AWS Account
- Create alias

### Crear una Organización

- Organizations
- Create

### Activar políticas de AWS Organizations

- Entrar a cuenta principal con usuario IAM
- Ir a AWS Organizations > Policies
- Activar las póliticas necesarias

:::note
No activamos ninguna política porque no fue necesario
:::

### Configurando `aws-cli`

Asumiendo que `aws-cli` ya está instalado.

1. En la carpeta `~/.aws` debería haber dos archivos, `config` y `credentials`.
1. En el archivo `credentials` agregamos la siguiente entrada, reemplazando `nombre-para-identificar` por un nombre para esta identidad (por ejemplo `lendaas`), y las access keys generadas en IAM:

```config
[nombre-para-identificar]
aws_access_key_id=ACCESS_KEY_ID
aws_secret_access_key=SECRET_ACCESS_KEY
```

## Crear cuentas personales

- Click en invitar (opción crear cuenta) y agregar el correo de la cuenta.
- Si falla y la invitación no llega:
  - Eliminar invitación
  - Eliminar cuenta
  - Repetir
- Aceptar la invitación que llega al correo.
- Entrar con opción User Root (usuario raíz).
- Presionar reestablecer contraseña.
- Sacar magister en captcha.

### Crear usuario con IAM en tu cuenta

- Inicia sesión en tu cuenta (como root user)

### Crea un grupo

- IAM
- Grupos
- Agregar grupo
- Elige un nombre para tu grupo (Admins)
- No agregues ningún usuario
- Asigna la política `AdministratorAccess`

### Crea un usuario y asignalo al grupo

- IAM
- Usuarios
- Agregar usuarios
- Elige un nombre para tu usuario
- Activa ambos checkbox para el ingreso
- Crea una contraseña
- Puedes requerir que sea cambiada en un próximo inicio de sesión o no
- Siguiente
- Asígnalo al grupo que creaste previamente
- Siguiente
- Crea una etiqueta si te interesa
- Crear

### Agrega un alias a tu cuenta personas

- IAM
- Dashboard / Panel
- Arriba a la derecha
- Crear alias
- Elige un nombre como alias para tu cuenta (es único)

### Inicia sesión con IAM

- Anda al login de AWS
- Elige iniciar sesión con IAM
- Ingresa el alias de tu cuenta
- Ingresa el usuario y contraseña que configuraste

## Cloud9 + GitLab

Cómo conectar tu entorno de Cloud9 con GitLab

- Crear ambiente
- Elegir un nombre interesante
- Configurar la máquina más liviana (tier gratuito)
- Crear

### Crear llave SSH

- `ssh-keygen`
- Configura tu llave a tu gusto
- `cat rut-llave-publica`
- Copias la llave pública

### Instalar llave en GitLab

- Inicia sesión en GitLab
- Arriba a la derecha: preferences
- Ssh Keys
- Pegas la llave
- Título: `cloud9-ide-key`

### Configurar Git

- `git config --global user.name "Benja Roa"`
- `git config --global user.email "benja@lendaas.com"`

🎊 **Ya conectaste tu entorno de Cloud9 con GitLab!**🎊

## Pipelines + SAM

Cómo crear un CI/CD con AWS a partir de una applicación SAM

### Crea una app con SAM

(usaremos el cli de sam)

- sam init
- arranca con tu template favorito

### Usuarios, roles y pipeline

- `sam pipeline bootstrap`
  - Genera los recursos AWS de infraestructura necesarios para correr el pipeline.
- `sam pipeline init --bootstrap`
- continuar, stage 1: dev
- acepta las sugerencias
- stage 2: prod
- acepta las sugencias

### Despliega la infra del pipeline

- `sam pipeline init`
- Definir los nombres de los stages (development-stack, production-satck)
- `export AWS_PROFILE=lendas-prod`, o el nombre del perfil que se usó en el paso "Configurando aws-cli".
- `sam deploy -t codepipeline.yaml --stack-name <nombre del repositorio> --capabilities=CAPABILITY_IAM`
- Conectar AWS con el repositorio GitHub [aquí](https://console.aws.amazon.com/codesuite/settings/connections). [Instrucciones más detalladas](https://docs.aws.amazon.com/dtconsole/latest/userguide/connections-update.html).

A modo de PoC, se:

- creó un repositorio en `CodeCommit`
- Empuja código en `CodeCommit`

## Configurar dominios en AWS

Cómo configuramos el dominio lendaas.com en AWS

- Servicio Route53.
- Creamos un Hosted Zone público con el dominio lendaas.com, cuyas rutas de tráfico son:

```js
[ns-498.awsdns-62.com](http://ns-498.awsdns-62.com/).
[ns-1866.awsdns-41.co.uk](http://ns-1866.awsdns-41.co.uk/).
[ns-1508.awsdns-60.org](http://ns-1508.awsdns-60.org/).
[ns-921.awsdns-51.net](http://ns-921.awsdns-51.net/).
```

- Estas rutas son agregados a la cuenta goDaddy para redirigir el tráfico a estas rutas desde el dominio lendaas.com. Sólo @ThomasCovain y @JavierRodriguez tienen acceso a este recurso

## Correo con WorkMail

Cómo crear correo y cambiar contraseña

### Cómo crear correo

- WorkMail
- Usar zona existente de Route53
- Crear usuarios
- Regla para los nombres de la cuentas: ninguna

### Cómo cambiar tu contraseña

- Inicia sesión [aquí](https://webmail.mail.us-east-1.awsapps.com/workmail/?organization=lendaas) en tu correo de lendaas
- Anda a settings (arriba a la derecha)
- En la pestaña General
- Change password
