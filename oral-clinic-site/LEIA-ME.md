# Site Oral Clinic — versão para GitHub + Vercel

Esta pasta é um site estático (HTML, CSS e JavaScript). **Não usa PHP**, porque a Vercel não executa PHP.

**Como o agendamento funciona:** o paciente informa nome e telefone (ou toca em "Agendar avaliação") e o WhatsApp abre com a mensagem pronta para a clínica. O site não guarda dados. A clínica recebe a mensagem no próprio WhatsApp.

## 1. Preencher os dados da clínica

Abra `assets/js/config.js` e preencha o **WhatsApp** (obrigatório para os botões funcionarem), Instagram, e-mail, responsável técnico e CRO. Telefone, endereço e horários já estão preenchidos.

## 2. VS Code, GitHub e Vercel

**Instalar (uma vez):** [VS Code](https://code.visualstudio.com), [Git](https://git-scm.com/downloads) e criar contas gratuitas no [GitHub](https://github.com) e na [Vercel](https://vercel.com). Entre na Vercel usando "Continue with GitHub".

**VS Code:**
1. Extraia esta pasta no seu computador.
2. Abra o VS Code > **Arquivo > Abrir Pasta** e escolha a pasta do site.
3. Abra o terminal do VS Code (**Terminal > Novo Terminal**) e rode, uma linha por vez:

```
git init
git add .
git commit -m "Primeira versão do site"
git branch -M main
```

**GitHub:**
1. No GitHub, clique em **New repository**. Nome: `oral-clinic-site`. Deixe **Private** e **não** marque "Add a README".
2. Na página que aparecer, copie as duas linhas do bloco "push an existing repository" e rode no terminal do VS Code. Elas são parecidas com:

```
git remote add origin https://github.com/SEU-USUARIO/oral-clinic-site.git
git push -u origin main
```

**Vercel:**
1. Na Vercel: **Add New > Project** e escolha o repositório `oral-clinic-site`.
2. Em **Framework Preset**, deixe **Other**. Não precisa de Build Command nem de Output Directory.
3. Clique em **Deploy**. Em um minuto o site abre num endereço `.vercel.app`.

**Domínio e subdomínio:** no projeto, **Settings > Domains > Add**, digite o subdomínio (por exemplo `oralclinic.seudominio.com.br`) e crie no seu provedor de domínio o registro DNS que a Vercel mostrar (normalmente um CNAME).

**Atualizar o site:** edite os arquivos no VS Code, e rode `git add .`, `git commit -m "o que mudou"` e `git push`. A Vercel publica sozinha.

## Vários clientes

Crie **um repositório e um projeto na Vercel por cliente** (copie esta pasta, troque logo, fotos, textos e `config.js`) e dê a cada um o seu subdomínio. Cada cliente tem o seu próprio WhatsApp configurado no `config.js`.

**Atenção ao plano da Vercel:** o plano gratuito (Hobby) só permite uso pessoal e não comercial. Sites feitos para clientes pagantes exigem o plano Pro, segundo a política da própria Vercel.

## Pendências antes de divulgar

- Trocar as fotos de IA por fotos reais.
- Preencher responsável técnico e CRO (exigência do CFO).
- Revisar `privacidade.html` com um advogado.
- Trocar `SEU-DOMINIO.com.br` no `sitemap.xml`.
- Testar no site publicado: preencher o formulário e conferir se o WhatsApp abre com a mensagem certa.

## Trocar as fotos

As fotos ficam em `assets/img/`. Mantenha os **mesmos nomes de arquivo** para não mexer no código: `hero.jpg` (capa), `sobre-recepcao.jpg`, `clinica-geral.jpg`, `ortodontia.jpg`, `implantes.jpg`, `clareamento.jpg`, `odontopediatria.jpg`, `estetica.jpg`.
- Capa: horizontal, com cerca de 1920 px de largura, até 300 KB. O texto fica à esquerda, então o rosto ou assunto principal deve ficar à direita. Se precisar reposicionar, ajuste `object-position` em `.hero-bg` no `assets/css/style.css`.
- Demais fotos: cerca de 800 px de largura, até 120 KB cada. Os cartões de serviço cortam a imagem em 4:3.
- Reduza o peso antes de enviar em squoosh.app.
