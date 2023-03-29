# Políticas de riesgo

Conceptos dnecesarios para su configuración.

## Tasa de interés

Llameremos `annualInterestRate` ($\tau_{a}$) al costo anual asociado a un crédito que define una compañía de financiamiento para sus clientes. Para efecto de los cálculos, usaremos la __tasa de interés mensual__, la que denotaremos como `monthlyInterestRate` ($\tau_{m}$) y que depende del __tipo de interés__ `interestType` ($\phi$) - simple o compuesto - que la compañía decida utilizar.

Si bien la tasa de interés puede cambiar en el tiempo, será una constante una vez aprobado el crédito (queda congelada).

$$
 \begin{matrix}
        \tau_{m}=\begin{cases}
            \sqrt[12]{\tau_{a}+1}-1 & \text{si} \ \phi = 0 \ \small{\text{(compuesta)}} \\
            \frac{\tau_{a}}{12} & \text{si} \ \phi = 1 \ \small{\text{(simple)}}
        \end{cases}
     \end{matrix}
$$

:::caution
Si existe un tasa máxima convencional (caso de Chile) se tomará ese valor como cota máxima
:::

## Meses de gracia

Llamaremos `numberOfGraceMonths` (${n}$) al beneficio que pide el cliente para postergar el pago de la primera cuota.

Otorgar meses de gracia puede acarrear un costo financiero para la compañía, por lo que en Lendaas la compañía podrá configurar - a través de la variable `graceMonthsInterestMethod` ($\kappa$) - dos opciones a sus clientes:

1. Los clientes sólo pagan los intereses de la cuota del crédito durante los meses ($\kappa = 0$)
2. Los clientes no pagan nada del crédito durante los meses de gracia, pero los intereses se van amortizando negativamente ($\kappa = 1$)

Para capturar todo lo anterior, el capital a amortizar será ajustado por un factor `adjustmentFactorGraceMonths` ($f_{mg}$), donde:

$$
f_{mg} = (1 + \tau_{m} \cdot \kappa)^{n}
$$

:::tip Nota

- Usar la opción número dos aumenta el costo del crédito, afectando al dividendo y el monto aprobado
- $\kappa$ por omisión debe ser igual a __1__. Solo puede ser 0 si hay ``meses de gracia``

:::

## Gastos operacionales

Los `operationalExpenses` ($G_{ops}$) consideran una serie de elementos propios del proceso de suscripción del crédito:

- Gastos de escrituación ($g_{e}$): `deedExpenses`
- Tasación ($g_{t}$): `appraisalExpenses`
- Estudio de título ($g_{et}$): `titleStudyExpenses`
- Gastos en notaría ($g_{n}$): `notaryExpenses`
- Inscripción de la propiedad ($\tau_{cbr}$): `realEstateExpensesRate`
- Impuesto al crédito ($\tau_{tie}$): `creditTaxRate`

La forma en cómo se calcula es:

$$
G_{ops} = g_{e} + g_{t} + g_{et} + g_{n} + \tau_{cbr} \cdot V_{p} + \tau_{tie} \cdot M_{cr}
$$
$$
G_{ops} = g_{e} + g_{t} + g_{et} + g_{n} + g_{p} + \tau_{tie} \cdot M_{cr}
$$
$$
G_{ops} = \sum_{i} g_i + M_{cr} \cdot \tau_{ite}
$$

Cuando el usuario elige incluir los `operationalExpenses` en el crédito, se captura a través de la variable `operationalExpensesFinancing` ($\epsilon = 1$).
Cuando eso sucede se activa la política defnida por el negocio define sobre qué parte financiará (o si la totalidad) que se encuentra indexada en los $\epsilon_{i}$ (ver parámetros).

Para  eso, se usarán la variable `percentageOperationalExpensesFinanced` ($G_{ops}^{fin}$) y una variable auxiliar ($g_{f}$) que representará el total de gastos fijos del gasto. Así, se obtiene que:

$$
G_{ops}^{fin} = \sum_{i} \epsilon_{i} \cdot g_i + (\epsilon_{ite} \cdot M_{cr} \cdot \tau_{ite})
$$
$$
G_{ops}^{fin} = g_{f} + (M_{cr} \cdot \tau_{ite} \cdot \epsilon_{ite})
$$

:::tip Nota
En caso que el usuario no lo elige, el negocio lo hace por él
:::

## Seguro de crédito

El seguro de crédito resguarda el default de un crédito (no pago en 180 días). La póliza usualmente la emite AVLA y, por lo general, el seguro se grava con impuestos, según cada país.

La `creditInsuranceFee` ($C_{s}^{cr}$) sólo existe cuando el financiamiento del seguro de crédito no va dentro del crédito, es decir, `creditInsuranceFinancing` es cero ($\sigma = 0$).
Cuando eso sucede, la [prima del seguro](https://creditu-team.gitlab.io/wiki/journeys/acquisition/evaluaci%C3%B3n/offer.html#seguro-de-credito)
se divide por `creditInsuranceNumberOfMonths` ($\lambda_{1}$).

El `creditInsurancePremium` ($\small{S_{cr}}$) se calcula siempre sobre el `financingAmount` ($\small{M_{fin}}$) o monto líquido usando `creditInsuranceRate` ($\tau_{cr}$):

$$
S_{cr} = M_{fin} \cdot \tau_{cr} \cdot (1+ \tau_{i})
$$

Se usará la variable auxiliar `creditInsuranceFactor` ($f_{scr}$) para simplificar la fórmula, quedando como:

$$
S_{cr} = M_{fin} \cdot f_{scr}
$$

Así, el cálculo quedaría de la siguiente manera:

$$
C_{s}^{cr} = \frac{M_{fin} \cdot f_{scr} \cdot (1 - \sigma)}{\lambda_{1}}
$$

Para simplificar el resultado, se define $K_{scr}$ como el multiplicador de $M_{fin}$, que está compuestos de datos conocidos (de inputs o parámetros).
Tomando además la definición del [monto de financiamiento](https://creditu-team.gitlab.io/wiki/journeys/acquisition/evaluaci%C3%B3n/offer.html#monto-de-financiamiento) se obtiene que:

$$
C_{s}^{cr} = M_{cr} \cdot K_{fin}^{1} \cdot K_{scr} - K_{fin}^{2} \cdot K_{scr}
$$

:::danger
Hay que tener cuidado que $\lambda_{1} \neq 0$, independientemente del valor que tome $\sigma$, ya que el modelo explotaría por dividir por cero. En caso que $\sigma = 1$, es mejor que $\lambda_{1} = 1$.
:::

## Seguro de desgravamen

El seguro de desgravamen resguarda el no pago del crédito ante la posibilidad de muerte del deudor (y co-deudor) y devuelve a Creditú el saldo insoluto.

El cálculo de la `lifeInsuranceFee` ($C_{s}^{d}$) dependerá de la `lifeInsuranceMonthlyRate` ($\tau_{d}^{d}$), `consignerLifeInsuranceMonthlyRate` ($\tau_{d}^{c}$)
y el número de codeudores indexados en la variable `amountOfConsigner` ($c$), escenario en el que la cuota se multiplica por la cantidad de ellos, dado que todos deben adquirir uno por separado.

$$
C_{s}^{d} = M_{cr} \cdot [\tau_{d}^{d} + c \cdot (\tau_{d}^{d} - \tau_{d}^{c})]
$$

:::tip Nota
En rigor, el monto asociado a este seguro cambia según el capital amortizado, pero para efectos de la evaluación se supondrá que todas las cuotas son iguales a la primera (criterio ácido)
:::

## Seguro de propiedad

El seguro de propiedad resguarda la hipoteca antes posibilidad de incendio y, en algunos casos, de sismos.

El cálculo de `propertyInsuranceFee` depende del `propertyValue` ($V_{p}$), la `propertyInsuranceMonthlyRate` ($\tau_{p}$) y el `propertyTypeFactor` ($f$):

$$
C_{s}^{p} = V_{p} \cdot f \cdot \tau_{p}
$$

## Seguro de cesantía

:::danger
To-do
:::

## Carga financiera

La carga financiera `backendRatio` ($CF$) representa la relación entre todas las deudas que tiene el prospecto (más su codeudor) `totalFee`  ($C_{tot}$)
y los ingresos mensuales `disposableIncome` ($I_{m}$).

En Creditú, existe un `maximumBackendRatio` ($\alpha$), el cual incluye el monto del crédito a otorgar:

$$
CF= \frac{C_{tot}} {I_{m}} \leq \alpha
$$

## Dividendo renta

El dividendo-renta `frontendRatio` ($DR$) representa la relación entre todas las deudas de largo plazo `longTermMonthlyFee` ($C_{lp}$) del prospecto (incluído el `creditAmount`) y los ingresos mensuales `disposableIncome` ($I_{m}$).

En Creditú, existe un `maximumFrontendRatio` ($\beta$) para el dividendo renta.

$$
DR= \frac{C_{cr} + C_{lp}} {I_{m}} \leq \beta
$$

## Deuda garantía

La relación deuda-garantía, más conocida como `loanToValue` ($LTV$), representa la relación entre pie (o adelanto) y el `propertyValue` ($V_{p}$).

En Creditú existen 2 tipos de LTV que cada negocio puede restringir, según lo que sea necesario:

$$
LTV_{viv}= \frac{M_{fin}} {V_{p}} \leq \gamma_{1}
$$
$$
LTV_{cr}= \frac{M_{fin} + S_{cr} \cdot \sigma + G_{ops}^{fin}\cdot \epsilon} {V_{p}} \leq \gamma_{2}
$$

:::tip Nota

Usualmente se utiliza $LTV_{viv}$

:::
