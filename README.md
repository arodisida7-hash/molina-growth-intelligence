# Molina Growth Intelligence

Demo ejecutivo construido con Next.js App Router para presentar una capa de inteligencia comercial sobre los sistemas existentes de una marca mexicana de alimentos.

## Propuesta del demo

`Molina Growth Intelligence` posiciona una capa de IA y analitica ejecutiva que integra marketing, ventas, distribucion y margen para priorizar expansion rentable.

No se plantea como reemplazo de CRM o ERP. La narrativa del producto es:

- Detectar oportunidades de crecimiento regional antes que la competencia.
- Alertar presion de margen y riesgo operativo antes de que impacten el resultado.
- Traducir senales dispersas en acciones ejecutivas semanales.

## Vistas principales

- `/overview`: centro de mando con KPIs, tendencia de ingresos, mix por canal, brief IA, alertas y acciones.
- `/product-margin`: matriz de desempeno por familia, tabla sortable, alertas de presion marginal y productos subaprovechados.
- `/opportunity-map`: mapa regional estilizado de Mexico con seleccion interactiva y recomendacion contextual.
- `/marketing-intelligence`: inversion por canal, comparativo de contenidos, tabla de campanas y temas creativos lideres.
- `/distribution-intelligence`: salud de distribuidores, scatterplot de penetracion vs demanda y segmentos de crecimiento.
- `/ai-opportunity-engine`: experiencia tipo copilot para revisar oportunidades, riesgos y generar un plan de accion.
- `/board-report`: memo semanal listo para consejo con resumen generado, oportunidades, riesgos y experimento estrategico.

## Arquitectura

### App Router

- `app/page.tsx`: portada premium de entrada al demo.
- `app/(dashboard)/*`: shell compartido y siete vistas ejecutivas.
- `app/api/report/route.ts`: endpoint mock para exponer el reporte generado en JSON.

### Datos y logica

- `lib/types.ts`: contratos tipados del dominio.
- `lib/mock-data.ts`: seed data deterministica para productos, regiones, canales, campanas, distribuidores y oportunidades.
- `lib/report.ts`: generador mock de memo ejecutivo y plan de accion.

### UI

- `components/layout/*`: sidebar, shell y navegacion responsive.
- `components/common/*`: encabezados, metric cards y contenedores de charts.
- `components/ui/*`: primitives estilo shadcn para card, button, badge, table y progress.
- `components/pages/*`: composicion de cada vista ejecutiva.

## Modelo de datos mock

Incluye:

- 8 familias de producto: Vainilla Natural, Extracto Natural, Vainilla Cristalina, Cocoa, Cacao en Polvo, Azucar Glass, Azucar Glass con Vainilla y Salsa de Soya.
- 9 regiones: CDMX, Guadalajara, Monterrey, Queretaro, Puebla, Leon, Merida, Tijuana y Cancun.
- 5 canales: Retail, Distribuidores, Food Service, E-commerce y Modern Trade.
- 5 tipos de campana: recetas, estacional, premium, producto y adquisicion B2B.
- 12 meses de ingresos, margen bruto y eficiencia comercial.

## Logica de scoring

La oportunidad regional usa una formula deterministica:

`opportunity_score = 0.27 * demand_growth + 0.18 * content_engagement + 0.24 * margin_potential + 0.18 * low_penetration + 0.13 * low_stock_risk`

Ademas:

- `margin_pressure` se activa cuando el margen cae en dos cortes consecutivos.
- Las recomendaciones por producto y region cambian segun margen, crecimiento, cobertura y canal dominante.
- El reporte del consejo toma las oportunidades y riesgos de mayor impacto para componer un memo ejecutivo.

## Experiencia visual

- Tema oscuro premium por defecto.
- Gradientes sutiles, cards redondeadas y layout de presentacion.
- Transiciones de hover, estado de carga elegante y resumen con efecto typing en el memo.
- Responsive para tablet y mobile, optimizado para desktop boardroom.

## Como correrlo

1. Instala dependencias:

```bash
npm install
```

2. Inicia el entorno local:

```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000).

## Nota de validacion

El workspace entregado estaba vacio y en este entorno no fue posible instalar dependencias por la restriccion de red. La estructura, el tipado y la app quedaron preparados para ejecutarse una vez que se corra `npm install`.
