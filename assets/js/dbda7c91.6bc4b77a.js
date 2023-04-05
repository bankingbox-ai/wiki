"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[1720],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>w});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),l=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=l(e.components);return a.createElement(c.Provider,{value:t},e.children)},u="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),u=l(n),m=r,w=u["".concat(c,".").concat(m)]||u[m]||p[m]||o;return n?a.createElement(w,i(i({ref:t},d),{},{components:n})):a.createElement(w,i({ref:t},d))}));function w(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[u]="string"==typeof e?e:r,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2899:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var a=n(7462),r=(n(7294),n(3905));const o={},i="AWS SAM",s={unversionedId:"documentation/how-did-we/aws-sam",id:"documentation/how-did-we/aws-sam",title:"AWS SAM",description:"Template",source:"@site/docs/documentation/how-did-we/aws-sam.md",sourceDirName:"documentation/how-did-we",slug:"/documentation/how-did-we/aws-sam",permalink:"/docs/documentation/how-did-we/aws-sam",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/documentation/how-did-we/aws-sam.md",tags:[],version:"current",frontMatter:{},sidebar:"wikiSidebar",previous:{title:"Cuentas para DB",permalink:"/docs/documentation/how-did-we/data-base"},next:{title:"Configurar la CI/CD",permalink:"/docs/documentation/how-did-we/continuous-integration"}},c={},l=[{value:"Template",id:"template",level:2},{value:"Outputs",id:"outputs",level:3},{value:"Redirigiendo p\xe1gina sin www a p\xe1gina con www",id:"redirigiendo-p\xe1gina-sin-www-a-p\xe1gina-con-www",level:2}],d={toc:l},u="wrapper";function p(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"aws-sam"},"AWS SAM"),(0,r.kt)("h2",{id:"template"},"Template"),(0,r.kt)("h3",{id:"outputs"},"Outputs"),(0,r.kt)("p",null,"Cuando desplegamos nuestro repositorio SAM, se generar\xe1n recursos y valores a los que necesitamos poder acceder despu\xe9s; por ejemplo, la URI de la API Gateway desplegada.\nPara poder rescatar estos valores, debemos declararlos en la secci\xf3n ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html"},(0,r.kt)("inlineCode",{parentName:"a"},"Outputs"))," del ",(0,r.kt)("inlineCode",{parentName:"p"},"template.yml")," de SAM."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yml"},'(...)\nOutputs:\n  WebEndpoint: # Para obtener endpoint API Gateway\n    Description: "Api Gateway endpoint URL for Prod stage"\n    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"\n  S3Bucket: # Para obtener nombre de bucket S3\n    Description: "S3 Bucket for static website content"\n    Value: !Ref S3Bucket\n  CloudfrontDistribution: # Para obtener distribution de Cloudfront\n    Description: "Cloudfront distribution for serverless website"\n    Value: !Ref CloudfrontDistribution\n')),(0,r.kt)("p",null,"Los valores pueden ser rescatados con ",(0,r.kt)("inlineCode",{parentName:"p"},"aws cloudformation describe-stacks --stack-name  NOMBRE_DEL_STACK > stack.json"),"."),(0,r.kt)("h2",{id:"redirigiendo-p\xe1gina-sin-www-a-p\xe1gina-con-www"},"Redirigiendo p\xe1gina sin www a p\xe1gina con www"),(0,r.kt)("p",null,"Creamos un bucket S3 llamado ",(0,r.kt)("inlineCode",{parentName:"p"},"lendaas.com-no-www"),".\nSe le activ\xf3 la opci\xf3n de ",(0,r.kt)("em",{parentName:"p"},"Static website hosting"),", y se configur\xf3 para que hosteara una direcci\xf3n web est\xe1tica, con documento index ",(0,r.kt)("inlineCode",{parentName:"p"},"index.html"),"\nEl archivo ",(0,r.kt)("inlineCode",{parentName:"p"},"index.html")," debe tener un redirect de la siguiente forma:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<!DOCTYPE html>\n<html>\n<body>\n<script>\n    window.location.replace("https://www.lendaas.com/");\n<\/script>\n</body>\n</html>\n')),(0,r.kt)("p",null,"Adicionalmente se cre\xf3 una nueva zona de distribuci\xf3n en ",(0,r.kt)("em",{parentName:"p"},"CloudFront")," con un dominio alternativo ",(0,r.kt)("inlineCode",{parentName:"p"},"lendaas.com")," y apuntando al bucket reci\xe9n creado."))}p.isMDXComponent=!0}}]);