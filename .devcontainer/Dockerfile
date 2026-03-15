FROM node:24-bookworm

# Установка Python 3.14
RUN apt-get update && apt-get install -y \
    software-properties-common \
    build-essential \
    curl \
    git \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Установка Python 3.14 из исходников (bookworm имеет более старую версию)
RUN curl -fsSL https://www.python.org/ftp/python/3.14.0/Python-3.14.0.tgz | tar xz \
    && cd Python-3.14.0 \
    && ./configure --enable-optimizations --with-ensurepip=install \
    && make -j$(nproc) \
    && make altinstall \
    && cd .. && rm -rf Python-3.14.0 \
    && ln -sf /usr/local/bin/python3.14 /usr/local/bin/python3 \
    && ln -sf /usr/local/bin/python3.14 /usr/local/bin/python \
    && ln -sf /usr/local/bin/pip3.14 /usr/local/bin/pip3 \
    && ln -sf /usr/local/bin/pip3.14 /usr/local/bin/pip

# Установка pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Установка Turborepo CLI
RUN pnpm add -g turbo

WORKDIR /workspace

# Установка Python-зависимостей (копируем requirements.txt отдельно для кэширования слоя)
COPY apps/api/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt && rm /tmp/requirements.txt
