# Contributing to NCU TOM
Congratulations on landing on this page!
This page summaries the process of contributing to the NCU TOM and some guidelines to help you get started.

## Pull requests

Any helpful pull requests are welcome! Here are some guidelines you should follow to boost your pull request:
1. Each PR should focus on a single issue.
2. PRs should target the dev branch.
3. Smaller PRs can be merged faster. If you're working on a larger PR, consider opening up a new issue for better tracking process.


## Commits

Each commit should follow the format we provided.
```
[type]: [Subject]

[context][Optional]
```

For example:

```
Feat: add new feature
Fix: issue b32f4 by altering some code...
Docs: update docs

The document of Contriuting is changed to make it easier to understand.
```

### Types

- **Feat**: A new feature
- **Fix**: A bug fix
- **Docs**: Documentation only changes
- **Style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **Refactor**: A code change that neither fixes a bug nor adds a feature
- **Enhance**: A code change that improves performance, scalability, etc
- **Test**: Adding missing tests or correcting existing tests

If you do not find a suitable type, feel free to open a new type and we will add it to the list.

## Code Style

> We will use ruff and eslint soon!

If you're using VSCode, please make sure your settings enables related formatters:
- ms-python.autopep8
- esbenp.prettier-vscode
- vscode.css-language-features


## Feedback, Advice, and General Help

Normally, it takes a few days for us to respond to your PRs, and it may iterates over time.
These steps are making sure that there is no conflict with each other.

Regarding the process, we are also trying to introduce bots to help our community. This is an important part of the project and we hope we can introduce bots soon to help.

If you're seeking help, please feel free to open an issue.

