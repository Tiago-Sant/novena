# novena-catolica-app

Projeto mínimo (boilerplate) para um app de novenas — pronto para deploy na Vercel.

Como usar:
1. `npm install`
2. `npm run dev`
3. Abra http://localhost:3000

Observações:
- Este scaffold é intencionalmente simples para facilitar deploy gratuito na Vercel.
- Adicione suas chaves, ajustes visuais e imagens conforme desejar.

## Transferir suas novenas

O aplicativo permite levar novenas em andamento e concluídas de um dispositivo para outro sem criar uma conta:

1. No dispositivo antigo, abra a tela inicial e clique em **Exportar**.
2. Transfira o arquivo `.json` baixado para o novo dispositivo usando um meio de sua preferência.
3. No novo dispositivo, clique em **Importar** e selecione esse arquivo.

A importação mescla os dados com o que já existe no dispositivo. Novenas com o mesmo identificador são atualizadas, sem criar duplicatas. O conteúdo das orações não é copiado, pois já faz parte do aplicativo; apenas o progresso, as datas e o histórico são transferidos.

O arquivo contém dados pessoais de uso e deve ser compartilhado somente por um meio confiável. Novenas que não existirem no catálogo da versão instalada serão ignoradas, enquanto as demais serão importadas normalmente.
