FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
         build-essential \
        libpq-dev postgresql-client vim less bash-completion curl wget sqlite3 \
        file dos2unix git jq tree ripgrep \
        procps iproute2 iputils-ping dnsutils netcat-openbsd lsof strace bsdextrautils \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22 LTS (needed to build the React frontend)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Build the React SPA so Django can serve it at /app/
RUN cd /app/front_end && npm ci && npm run build

EXPOSE 9000
