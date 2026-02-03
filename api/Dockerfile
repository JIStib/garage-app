FROM php:8.2-apache

# 1. Dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libssl-dev \
    pkg-config \
    autoconf \
    build-essential \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        zip

# 2. Extension PHP grpc

# RUN pecl install grpc \
#     && docker-php-ext-enable grpc

RUN apt-get update && apt-get install -y zlib1g-dev libicu-dev g++ \
    && pecl install grpc \
    && docker-php-ext-enable grpc

# 3. Activer Apache mod_rewrite
RUN a2enmod rewrite

# 4. Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 5. Configuration Apache
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# 6. Dossier de travail
WORKDIR /var/www/html

# 7. Copier le projet
COPY . .

# 8. Installer dépendances Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# 9. Installer Firebase + Firestore
RUN composer require \
    kreait/laravel-firebase \
    google/cloud-firestore

# 10. Publier la config Firebase
RUN php artisan vendor:publish \
    --provider="Kreait\\Laravel\\Firebase\\ServiceProvider" \
    --tag=config

# 11. Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# 12. Port
EXPOSE 80
