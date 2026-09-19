from django.core.management.base import BaseCommand

from core.models import Product


class Command(BaseCommand):

    help = "Create the initial X-FIT shop product catalog."

    def handle(self, *args, **options):

        products = [

            {
                "name": "X-FIT Core Tee",
                "slug": "x-fit-core-tee",
                "category": "tshirts",
                "price": 799,
                "stock": 100,
                "colors": [
                    "Black",
                    "White",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Premium performance fabric",
                "fit": "Athletic regular fit",
                "features": [
                    "Sweat-wicking",
                    "Quick-dry",
                    "Lightweight",
                    "Breathable",
                ],
            },

            {
                "name": "X-FIT Elite Tee",
                "slug": "x-fit-elite-tee",
                "category": "tshirts",
                "price": 899,
                "stock": 100,
                "colors": [
                    "Black",
                    "Lime",
                    "White",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Performance athletic fabric",
                "fit": "Athletic fit",
                "features": [
                    "Sweat-wicking",
                    "Quick-dry",
                    "Breathable",
                    "Lightweight",
                ],
            },

            {
                "name": "X-FIT Beast Tee",
                "slug": "x-fit-beast-tee",
                "category": "tshirts",
                "price": 899,
                "stock": 100,
                "colors": [
                    "Black",
                    "Red",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Performance fabric",
                "fit": "Athletic fit",
                "features": [
                    "Sweat-wicking",
                    "Quick-dry",
                    "Breathable",
                ],
            },

            {
                "name": "X-FIT Vertical Tee",
                "slug": "x-fit-vertical-tee",
                "category": "tshirts",
                "price": 799,
                "stock": 100,
                "colors": [
                    "Black",
                    "Grey",
                    "White",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Performance cotton blend",
                "fit": "Regular athletic fit",
                "features": [
                    "Breathable",
                    "Lightweight",
                    "Training ready",
                ],
            },

            {
                "name": "X-FIT Training Tee",
                "slug": "x-fit-training-tee",
                "category": "tshirts",
                "price": 799,
                "stock": 100,
                "colors": [
                    "Black",
                    "Blue",
                    "White",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Training performance fabric",
                "fit": "Athletic fit",
                "features": [
                    "Sweat-wicking",
                    "Quick-dry",
                    "Breathable",
                ],
            },

            {
                "name": "X-FIT Compression Pro",
                "slug": "x-fit-compression-pro",
                "category": "compression",
                "price": 999,
                "stock": 100,
                "colors": [
                    "Black / Lime",
                    "Black / Red",
                    "Black / Blue",
                    "Graphite",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "88% Polyester / 12% Elastane",
                "fit": "Performance compression fit",
                "features": [
                    "4-way stretch",
                    "Sweat-wicking",
                    "Quick-dry",
                    "Flatlock seams",
                    "Breathable panels",
                    "Reduced chafing",
                ],
            },

            {
                "name": "X-FIT Compression Max",
                "slug": "x-fit-compression-max",
                "category": "compression",
                "price": 999,
                "stock": 100,
                "colors": [
                    "White",
                    "Black",
                    "Blue",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Performance compression fabric",
                "fit": "Compression fit",
                "features": [
                    "4-way stretch",
                    "Quick-dry",
                    "Sweat-wicking",
                ],
            },

            {
                "name": "X-FIT Compression Hybrid",
                "slug": "x-fit-compression-hybrid",
                "category": "compression",
                "price": 999,
                "stock": 100,
                "colors": [
                    "Red",
                    "Black",
                    "White",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Performance stretch fabric",
                "fit": "Compression athletic fit",
                "features": [
                    "4-way stretch",
                    "Quick-dry",
                    "Breathable",
                    "Sweat-wicking",
                ],
            },

            {
                "name": "X-FIT Compression Elite",
                "slug": "x-fit-compression-elite",
                "category": "compression",
                "price": 999,
                "stock": 100,
                "colors": [
                    "Blue",
                    "Black",
                    "Graphite",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Premium compression fabric",
                "fit": "Elite compression fit",
                "features": [
                    "4-way stretch",
                    "Sweat-wicking",
                    "Quick-dry",
                    "Breathable panels",
                ],
            },

            {
                "name": "X-FIT Compression Stealth",
                "slug": "x-fit-compression-stealth",
                "category": "compression",
                "price": 999,
                "stock": 100,
                "colors": [
                    "Graphite",
                    "Black",
                    "Olive",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Technical performance fabric",
                "fit": "Stealth compression fit",
                "features": [
                    "4-way stretch",
                    "Quick-dry",
                    "Sweat-wicking",
                    "Reduced chafing",
                ],
            },

            {
                "name": "X-FIT Performance Hoodie",
                "slug": "x-fit-performance-hoodie",
                "category": "hoodies",
                "price": 1499,
                "stock": 75,
                "colors": [
                    "Black",
                    "Graphite",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Performance fleece",
                "fit": "Athletic relaxed fit",
                "features": [
                    "Warm",
                    "Breathable",
                    "Training ready",
                ],
            },

            {
                "name": "X-FIT Training Shorts",
                "slug": "x-fit-training-shorts",
                "category": "shorts",
                "price": 699,
                "stock": 100,
                "colors": [
                    "Black",
                    "Grey",
                    "Blue",
                ],
                "sizes": [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                ],
                "material": "Lightweight performance fabric",
                "fit": "Training fit",
                "features": [
                    "Quick-dry",
                    "Lightweight",
                    "Breathable",
                ],
            },

            {
                "name": "X-FIT Training Cap",
                "slug": "x-fit-training-cap",
                "category": "accessories",
                "price": 599,
                "stock": 100,
                "colors": [
                    "Black",
                    "White",
                ],
                "sizes": [
                    "FREE SIZE",
                ],
                "material": "Performance fabric",
                "fit": "Adjustable",
                "features": [
                    "Lightweight",
                    "Breathable",
                ],
            },

            {
                "name": "X-FIT Performance Shaker",
                "slug": "x-fit-performance-shaker",
                "category": "accessories",
                "price": 699,
                "stock": 100,
                "colors": [
                    "Black",
                    "Lime",
                ],
                "sizes": [
                    "700ML",
                ],
                "material": "BPA-free performance plastic",
                "fit": "700ML",
                "features": [
                    "Leak resistant",
                    "Mixing grid",
                    "Gym ready",
                ],
            },

            {
                "name": "X-FIT Gym Bag",
                "slug": "x-fit-gym-bag",
                "category": "bags",
                "price": 1299,
                "stock": 50,
                "colors": [
                    "Black",
                    "Graphite",
                ],
                "sizes": [
                    "STANDARD",
                ],
                "material": "Durable performance fabric",
                "fit": "Training bag",
                "features": [
                    "Large storage",
                    "Durable",
                    "Gym ready",
                ],
            },

            {
                "name": "X-FIT Gym Towel",
                "slug": "x-fit-gym-towel",
                "category": "accessories",
                "price": 399,
                "stock": 150,
                "colors": [
                    "Black",
                    "Lime",
                    "Grey",
                ],
                "sizes": [
                    "STANDARD",
                ],
                "material": "Soft absorbent fabric",
                "fit": "Gym towel",
                "features": [
                    "Absorbent",
                    "Quick-dry",
                    "Lightweight",
                ],
            },
        ]

        created_count = 0
        updated_count = 0

        for data in products:

            slug = data["slug"]

            product, created = Product.objects.update_or_create(
                slug=slug,
                defaults=data
            )

            if created:

                created_count += 1

            else:

                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"X-FIT catalog ready. "
                f"Created: {created_count}, "
                f"Updated: {updated_count}"
            )
        )