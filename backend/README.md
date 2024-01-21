# prism-api

Prism Backend implemented with FastAPI

## Setup

1. Create a new conda environment and install python 3.10

```bash
conda create -n cs4261
conda install python=3.11
```

2. Install poetry

```bash
curl -sSL https://install.python-poetry.org | python -
```

3. Install packages and activate the virtual environment

```bash
poetry install
poetry shell
```

4. Setup pre-commit git hook

```bash
pre-commit install
```

5. Create .env file

```bash
touch .env
```

6. Paste the following to the .env file

```bash
API_KEY="773cf9ff6d4346ff912234027241801"

AWS_ACCESS_KEY="AKIA6ODU5UCSVNCPCVK7"
AWS_SECRET_ACCESS_KEY="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"
AWS_REGION="us-east-2"

DYNAMODB_USER_TABLE="fpa-user"
```

7. Run the api using the following command

```bash
cd app
python -m uvicorn main:app --workers 4
```

## Before committing

Run the following command

```bash
pre-commit run --all-files
```

You can also fix auto-fixable ruff erros by running the following command

```bash
ruff check . --fix
```

## Adding new packages

Use the following command

```bash
poetry add [PACKAGE_NAME]
```

## ETC

### Delete **pycache**

```bash
find . | grep -E "(/__pycache__$|\.pyc$|\.pyo$)" | xargs rm -rf
```

### Delete local branches

```bash
git branch | grep -v "main" | xargs git branch -D
```
