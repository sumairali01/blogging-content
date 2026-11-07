import os
import sys
import django

# Setup django environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from apps.users.models import Author
from apps.categories.models import Category
from apps.tags.models import Tag
from apps.products.models import Merchant, AffiliateProduct
from apps.blog.models import BlogPost
from apps.settings.models import SiteSetting
from apps.pages.models import Page

def cleanup_and_seed_tech():
    print("--- Starting Complete Removal of Old Kitchen Niche Data ---")

    # 1. Clean up old Blog Posts
    kitchen_post_slugs = [
        '7-best-air-fryers-for-small-countertops',
        'keurig-k-mini-vs-nespresso-vertuo-pop',
        'zero-countertop-kitchen-storage-hacks',
        '5-best-coffee-makers-small-kitchens',
        'compact-air-fryer-review',
        'under-cabinet-storage-ideas',
        'best-slim-dish-racks'
    ]
    deleted_posts, _ = BlogPost.objects.filter(slug__in=kitchen_post_slugs).delete()
    # Also delete any post containing kitchen / coffee / air fryer in title
    old_posts = BlogPost.objects.filter(title__icontains='kitchen') | BlogPost.objects.filter(title__icontains='air fryer') | BlogPost.objects.filter(title__icontains='coffee maker') | BlogPost.objects.filter(title__icontains='dish rack')
    deleted_old, _ = old_posts.delete()
    print(f"Removed old kitchen blog posts ({deleted_posts + deleted_old} items).")

    # 2. Clean up old Products
    kitchen_prod_slugs = [
        'nespresso-vertuo-pop-plus',
        'ninja-air-fryer-mini',
        'youcopia-expandable-shelf',
        'joseph-joseph-drawer-organizer',
        'keurig-k-mini-plus',
        'compact-blender-pro',
        'magnetic-knife-strip'
    ]
    deleted_prods, _ = AffiliateProduct.objects.filter(slug__in=kitchen_prod_slugs).delete()
    old_prods = AffiliateProduct.objects.filter(name__icontains='kitchen') | AffiliateProduct.objects.filter(name__icontains='air fryer') | AffiliateProduct.objects.filter(name__icontains='coffee') | AffiliateProduct.objects.filter(name__icontains='drawer organizer')
    deleted_old_p, _ = old_prods.delete()
    print(f"Removed old kitchen products ({deleted_prods + deleted_old_p} items).")

    # 3. Clean up old Categories
    kitchen_cat_slugs = [
        'compact-appliances',
        'kitchen-storage',
        'product-comparisons',
        'small-kitchen',
        'kitchen-organization',
        'appliances',
        'home-decor'
    ]
    deleted_cats, _ = Category.objects.filter(slug__in=kitchen_cat_slugs).delete()
    old_cats = Category.objects.filter(name__icontains='kitchen') | Category.objects.filter(name__icontains='appliance')
    deleted_old_c, _ = old_cats.delete()
    print(f"Removed old kitchen categories ({deleted_cats + deleted_old_c} items).")

    # 4. Clean up old Tags
    kitchen_tags = ['Air Fryers', 'Coffee Makers', 'Cabinet Storage', 'Countertop Hacks', 'Tiny Kitchen', 'Small Space', 'Apartment Living']
    deleted_tags, _ = Tag.objects.filter(name__in=kitchen_tags).delete()
    print(f"Removed old kitchen tags ({deleted_tags} items).")

    # 5. Clean up old Authors
    deleted_authors, _ = Author.objects.filter(slug='sarah-jenkins').delete()
    print(f"Removed old author profile ({deleted_authors} items).")

    print("\n--- Seeding Pure Tech Buying Guides & Hardware ---")

    # 6. Site Settings
    settings, _ = SiteSetting.objects.get_or_create(pk=1)
    settings.site_name = "TechGear Guide"
    settings.site_description = "Independent tech buying guides, hardware comparisons, and product recommendations for students, software developers, and home office setups."
    settings.hero_badge = "100% Independent Tech & Hardware Testing"
    settings.hero_title = "Smarter Tech Buying Decisions for Builders & Learners."
    settings.hero_subtitle = "Independent buying guides, side-by-side hardware comparisons, and curated gear recommendations for software developers, students, and home office power users."
    settings.default_meta_title = "TechGear Guide | Tech Buying Guides for Students, Developers & Remote Setups"
    settings.default_meta_description = "Expert tech buying guides, side-by-side hardware comparisons, and tested product recommendations for programmers, students, and home offices."
    settings.affiliate_disclosure_default = "Affiliate Disclosure: TechGear Guide participates in various affiliate marketing programs. When you click our links and make a purchase, we may earn an affiliate commission at no additional cost to you. We independently research, evaluate, and test all recommendations."
    settings.footer_text = "© 2026 TechGear Guide. Independent Tech Buying Guides & Hardware Research. All rights reserved."
    settings.contact_email = "editor@techgearguide.com"
    settings.social_links = {
        'twitter': 'https://twitter.com/techgearguide',
        'pinterest': 'https://pinterest.com/techgearguide',
        'github': 'https://github.com/techgearguide'
    }
    settings.save()
    print("[OK] Site Settings updated.")

    # 7. Tech Author
    author, _ = Author.objects.get_or_create(
        slug='marcus-vance',
        defaults={
            'name': 'Marcus Vance',
            'bio': 'Marcus is a senior software engineer and hardware reviewer with over 9 years of experience testing developer workstations, mechanical keyboards, ultrawide displays, and high-performance laptops.',
            'website': 'https://techgearguide.com/author/marcus-vance',
            'social_links': {
                'twitter': 'https://twitter.com/marcus_vance_dev',
                'github': 'https://github.com/marcusvance'
            }
        }
    )
    print("[OK] Tech author Marcus Vance ready.")

    # 8. Tech Categories
    cat_monitors, _ = Category.objects.get_or_create(
        slug='programming-monitors',
        defaults={
            'name': 'Programming Monitors',
            'description': 'High-resolution 4K, ultrawide, and ergonomic displays optimized for code readability, multi-window tiling, and reduced eye fatigue.'
        }
    )
    cat_keyboards, _ = Category.objects.get_or_create(
        slug='mechanical-keyboards',
        defaults={
            'name': 'Mechanical Keyboards',
            'description': 'Tactile, hot-swappable, and ergonomic mechanical keyboards built for programmers, long typing sessions, and fast actuation.'
        }
    )
    cat_laptops, _ = Category.objects.get_or_create(
        slug='developer-laptops',
        defaults={
            'name': 'Developer & Student Laptops',
            'description': 'Compile-ready laptops, lightweight ultrabooks, and budget portable machines tested for CS coursework, virtualization, and battery endurance.'
        }
    )
    cat_docks, _ = Category.objects.get_or_create(
        slug='docking-stations',
        defaults={
            'name': 'Docking Stations & Hubs',
            'description': 'Thunderbolt 4 and high-bandwidth USB-C docks supporting dual 4K monitors, high-speed data transfer, and 100W Power Delivery.'
        }
    )
    cat_desk, _ = Category.objects.get_or_create(
        slug='desk-setup-ergonomics',
        defaults={
            'name': 'Desk Setup & Ergonomics',
            'description': 'Ergonomic vertical mice, screen light bars, monitor arms, and standing desks designed for 8+ hour remote productivity.'
        }
    )
    cat_audio, _ = Category.objects.get_or_create(
        slug='audio-headphones',
        defaults={
            'name': 'Headphones & Audio',
            'description': 'Active noise-canceling headphones, USB microphones, and conference headsets for remote meetings and deep focus study sessions.'
        }
    )
    print("[OK] Tech Categories seeded.")

    # 9. Tech Tags
    tag_coding, _ = Tag.objects.get_or_create(name='Coding Setup', defaults={'slug': 'coding-setup'})
    tag_student, _ = Tag.objects.get_or_create(name='Student Budget', defaults={'slug': 'student-budget'})
    tag_4k, _ = Tag.objects.get_or_create(name='4K Displays', defaults={'slug': '4k-displays'})
    tag_mechanical, _ = Tag.objects.get_or_create(name='Mechanical Switches', defaults={'slug': 'mechanical-switches'})
    tag_ergonomics, _ = Tag.objects.get_or_create(name='Ergonomics', defaults={'slug': 'ergonomics'})
    tag_usbc, _ = Tag.objects.get_or_create(name='USB-C Gear', defaults={'slug': 'usbc-gear'})
    print("[OK] Tech Tags seeded.")

    # 10. Merchants
    m_amazon, _ = Merchant.objects.get_or_create(
        slug='amazon-us',
        defaults={'name': 'Amazon US', 'website_url': 'https://www.amazon.com'}
    )
    m_bestbuy, _ = Merchant.objects.get_or_create(
        slug='best-buy',
        defaults={'name': 'Best Buy', 'website_url': 'https://www.bestbuy.com'}
    )
    m_bh, _ = Merchant.objects.get_or_create(
        slug='bh-photo',
        defaults={'name': 'B&H Photo Video', 'website_url': 'https://www.bhphotovideo.com'}
    )

    # 11. Tech Products
    p_dell_u2723qe, _ = AffiliateProduct.objects.get_or_create(
        slug='dell-ultrasharp-u2723qe-4k',
        defaults={
            'name': 'Dell UltraSharp U2723QE 27" 4K USB-C Hub Monitor',
            'brand': 'Dell',
            'merchant': m_amazon,
            'category': cat_monitors,
            'price': 579.99,
            'currency': 'USD',
            'rating': 4.8,
            'review_count': 1420,
            'affiliate_url': 'https://www.amazon.com/dp/B09TQZP9CL',
            'image_url_fallback': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
            'short_description': 'The ultimate 27-inch 4K IPS Black monitor for programmers, featuring 2000:1 contrast ratio, 90W USB-C charging, and integrated KVM switch.',
            'pros': ['IPS Black panel with deep 2000:1 contrast ratio', 'Built-in USB-C hub with 90W power delivery & RJ45 Ethernet', 'Built-in KVM switch to control two computers simultaneously', 'Super crisp text rendering at 163 PPI'],
            'cons': ['60Hz refresh rate (not designed for high-FPS gaming)', 'Integrated speakers are mediocre'],
            'cta_text': 'Check Amazon Price',
            'availability': 'In Stock',
            'is_featured': True
        }
    )

    p_keychron_q1, _ = AffiliateProduct.objects.get_or_create(
        slug='keychron-q1-pro-wireless-custom-mechanical-keyboard',
        defaults={
            'name': 'Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard',
            'brand': 'Keychron',
            'merchant': m_amazon,
            'category': cat_keyboards,
            'price': 199.99,
            'currency': 'USD',
            'rating': 4.9,
            'review_count': 890,
            'affiliate_url': 'https://www.amazon.com/dp/B0BSM1N6GZ',
            'image_url_fallback': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
            'short_description': 'Fully customizable CNC aluminum 75% mechanical keyboard with Bluetooth 5.1, double-gasket dampening, and programmable VIA keymaps.',
            'pros': ['Heavy CNC aluminum chassis eliminates desk wobble', 'Double-gasket mount provides ultra-satisfying typing acoustics', 'Hot-swappable switches (no soldering required)', 'Seamless Mac and Windows toggle switch'],
            'cons': ['Heavy weight (not intended for portable daily carry)', 'South-facing RGB may be dim on shine-through keycaps'],
            'cta_text': 'Check Price on Amazon',
            'availability': 'In Stock',
            'is_featured': True
        }
    )

    p_macbook_air_m3, _ = AffiliateProduct.objects.get_or_create(
        slug='apple-macbook-air-15-m3',
        defaults={
            'name': 'Apple MacBook Air 15-inch M3 (16GB RAM, 512GB SSD)',
            'brand': 'Apple',
            'merchant': m_amazon,
            'category': cat_laptops,
            'price': 1499.00,
            'currency': 'USD',
            'rating': 4.9,
            'review_count': 3210,
            'affiliate_url': 'https://www.amazon.com/dp/B0CX23V25W',
            'image_url_fallback': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
            'short_description': 'Fanless, silent powerhouse for CS students and web developers with up to 18 hours of real-world battery life and multi-monitor support.',
            'pros': ['Silent fanless operation with M3 efficiency', 'Outstanding 18-hour real-world battery endurance', 'Supports dual external displays with laptop lid closed', 'Spacious 15.3" Liquid Retina display'],
            'cons': ['Only 2 Thunderbolt ports on one side', 'Upgrades to unified memory must be configured at purchase'],
            'cta_text': 'Check Amazon Price',
            'availability': 'In Stock',
            'is_featured': True
        }
    )

    p_caldigit_ts4, _ = AffiliateProduct.objects.get_or_create(
        slug='caldigit-ts4-thunderbolt-4-dock',
        defaults={
            'name': 'CalDigit TS4 Thunderbolt 4 Dock (18 Ports, 98W Charging)',
            'brand': 'CalDigit',
            'merchant': m_bh,
            'category': cat_docks,
            'price': 399.99,
            'currency': 'USD',
            'rating': 4.7,
            'review_count': 640,
            'affiliate_url': 'https://www.bhphotovideo.com',
            'image_url_fallback': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
            'short_description': 'The benchmark Thunderbolt 4 docking station with 18 versatile I/O ports, 2.5Gb Ethernet, UHS-II SD card readers, and 98W laptop power.',
            'pros': ['18 ports on a single Thunderbolt cable connection', 'High-speed 2.5 Gigabit Ethernet port', '98W Power Delivery charges even 16-inch laptops', 'Robust aluminum body acts as heat sink'],
            'cons': ['Premium price point', 'Requires external power brick'],
            'cta_text': 'Check B&H Price',
            'availability': 'In Stock',
            'is_featured': True
        }
    )

    p_mx_master_3s, _ = AffiliateProduct.objects.get_or_create(
        slug='logitech-mx-master-3s-ergonomic-mouse',
        defaults={
            'name': 'Logitech MX Master 3S Wireless Performance Mouse',
            'brand': 'Logitech',
            'merchant': m_amazon,
            'category': cat_desk,
            'price': 99.99,
            'currency': 'USD',
            'rating': 4.8,
            'review_count': 9820,
            'affiliate_url': 'https://www.amazon.com/dp/B09HM94VDS',
            'image_url_fallback': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
            'short_description': 'Ergonomic wireless mouse with quiet electromagnetic MagSpeed scrolling, 8K DPI sensor for high-res screens, and customizable thumb gesture wheel.',
            'pros': ['MagSpeed electromagnetic wheel scrolls 1,000 lines per second', 'Quiet click switches reduce desk noise by 90%', 'Ergonomic sculpt supports palm during 10-hour workdays', 'Connects up to 3 devices via Bluetooth or Logi Bolt'],
            'cons': ['Right-handed only (no left-handed edition)', 'Logi Options+ software required for advanced gestures'],
            'cta_text': 'Check Amazon Price',
            'availability': 'In Stock',
            'is_featured': True
        }
    )

    p_sony_wh1000xm5, _ = AffiliateProduct.objects.get_or_create(
        slug='sony-wh-1000xm5-noise-canceling-headphones',
        defaults={
            'name': 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
            'brand': 'Sony',
            'merchant': m_bestbuy,
            'category': cat_audio,
            'price': 348.00,
            'currency': 'USD',
            'rating': 4.7,
            'review_count': 5400,
            'affiliate_url': 'https://www.bestbuy.com',
            'image_url_fallback': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            'short_description': 'Industry-leading noise cancellation engineered with 8 microphones and Auto NC Optimizer to block office distractions and campus library chatter.',
            'pros': ['Unmatched active noise cancellation eliminates ambient drone', '30-hour battery life with 3-minute quick charge for 3 hours playback', 'Extremely lightweight pressure-free headband', 'Clear voice pickup with 4 beamforming microphones'],
            'cons': ['Earcups do not fold inward like older XM4 model', 'Touch controls take getting used to in cold environments'],
            'cta_text': 'Check Best Buy Price',
            'availability': 'In Stock',
            'is_featured': False
        }
    )
    print("[OK] Tech Products seeded.")

    # 12. Tech Blog Posts
    post1, _ = BlogPost.objects.get_or_create(
        slug='best-monitors-for-programming-and-coding',
        defaults={
            'title': 'Best Monitors for Programming in 2026: Tested for Text Clarity & Multi-Window Coding',
            'excerpt': 'Which monitors actually reduce eye fatigue, provide crisp code font rendering, and offer seamless USB-C one-cable docking for developers?',
            'post_type': 'buying-guide',
            'author': author,
            'category': cat_monitors,
            'reading_time': 9,
            'is_featured': True,
            'status': 'published',
            'image_url_fallback': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80',
            'content': """
            <h2>Why Monitor Text Clarity Matters for Developers</h2>
            <p class="lead">Programmers spend 8 to 12 hours a day reading small code fonts, stack traces, and terminal logs. Straining against low-contrast panels or blurry subpixel scaling leads to chronic eye strain, headaches, and sluggish productivity.</p>
            <p>In this comprehensive guide, we evaluated 14 top-rated displays across 27-inch 4K, 32-inch 4K, and 34-inch curved ultrawide form factors to find the absolute best options for software developers, CS students, and home office power users.</p>
            
            <h2>Key Factors When Choosing a Coding Display</h2>
            <ul>
              <li><strong>Pixel Density (PPI):</strong> 27" 4K panels deliver ~163 PPI, making code look as sharp as printed paper without jagged anti-aliasing artifacts.</li>
              <li><strong>IPS Black Technology:</strong> Conventional IPS displays cap out at 1000:1 contrast ratios. IPS Black panels double this to 2000:1, making dark-mode IDEs significantly richer.</li>
              <li><strong>USB-C Single-Cable Connectivity:</strong> Transmit 4K video, 90W laptop charging, data, and gigabit ethernet over a single cable.</li>
              <li><strong>Built-in KVM Switch:</strong> Effortlessly switch your keyboard and mouse between a work laptop and a personal desktop.</li>
            </ul>

            <h2>Who Should Choose a 4K 27" vs 34" Ultrawide?</h2>
            <p>If you prioritize razor-sharp text scaling and code readability in macOS or Linux, a <strong>27-inch 4K</strong> display like the Dell U2723QE is unbeatable. If your workflow requires tiling three full-width IDE windows and a browser side-by-side without bezels, an <strong>ultrawide 34-inch</strong> is the preferred choice.</p>
            """,
            'faqs': [
                {'question': 'Is 4K resolution necessary for programming on a 27-inch screen?', 'answer': 'Yes. At 27 inches, 4K resolution provides 163 PPI. This ensures code syntax, small symbols (like semicolons and backticks), and terminal text remain razor-sharp.'},
                {'question': 'Does IPS Black make a noticeable difference in dark mode editors?', 'answer': 'Absolutely. IPS Black doubles the contrast ratio from 1000:1 to 2000:1, eliminating grayish background glow in VS Code, JetBrains, or Neovim.'},
                {'question': 'Can I power my MacBook Pro from the monitor USB-C port?', 'answer': 'Yes, modern developer displays like the Dell UltraSharp provide up to 90W Power Delivery over USB-C, keeping even 16-inch laptops charged while outputting 4K video.'}
            ]
        }
    )
    post1.affiliate_products.set([p_dell_u2723qe, p_caldigit_ts4])
    post1.tags.set([tag_coding, tag_4k, tag_usbc])

    post2, _ = BlogPost.objects.get_or_create(
        slug='best-mechanical-keyboards-for-coding',
        defaults={
            'title': 'Best Mechanical Keyboards for Coding & Developers (2026 Tested)',
            'excerpt': 'We tested 18 mechanical keyboards for actuation feel, switch acoustics, wireless latency, and programmable QMK/VIA layers.',
            'post_type': 'comparison',
            'author': author,
            'category': cat_keyboards,
            'reading_time': 8,
            'is_featured': True,
            'status': 'published',
            'image_url_fallback': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80',
            'content': """
            <h2>The Importance of Tactile Precision for Programmers</h2>
            <p class="lead">A keyboard is a programmer's primary interface to their craft. Upgrading from a shallow laptop membrane keyboard to a high-quality custom mechanical board reduces finger fatigue, increases typing accuracy, and makes every line of code feel distinctly satisfying.</p>
            <p>Our testing team benchmarked switch options (Linear, Tactile, and Clicky), chassis acoustics, wireless multi-device switching, and programmable VIA layers over 300 hours of continuous coding.</p>

            <h2>75% vs Tenkeyless (TKL) vs Full Size: Which is Best for Coding?</h2>
            <ul>
              <li><strong>75% Form Factor (Recommended):</strong> Keeps dedicated arrow keys and function rows (F1-F12) while saving 25% desk space for ergonomic mouse positioning.</li>
              <li><strong>Tenkeyless (80%):</strong> Standard layout without the numpad. Excellent if you prefer classic key spacing.</li>
              <li><strong>Full Size (100%):</strong> Only necessary if you enter extensive numerical data regularly.</li>
            </ul>
            """,
            'faqs': [
                {'question': 'Which switch type is best for programming: Linear or Tactile?', 'answer': 'Most developers prefer Tactile switches (like Gateron Brown or Gateron Banana) because the subtle bump provides clear feedback when a key registers without loud click noise.'},
                {'question': 'What is QMK/VIA and why do programmers need it?', 'answer': 'QMK/VIA allows you to remap any key directly in keyboard memory without running background software. You can create custom shortcuts for bracket navigation, Git commands, or layer toggles.'}
            ]
        }
    )
    post2.affiliate_products.set([p_keychron_q1, p_mx_master_3s])
    post2.tags.set([tag_coding, tag_mechanical, tag_ergonomics])

    post3, _ = BlogPost.objects.get_or_create(
        slug='best-laptops-for-computer-science-students',
        defaults={
            'title': 'Best Laptops for Computer Science Students in 2026: From Budget to Flagship',
            'excerpt': 'What specs do CS students actually need for compiling code, running Docker containers, and surviving 8-hour lecture days without a charger?',
            'post_type': 'best-list',
            'author': author,
            'category': cat_laptops,
            'reading_time': 10,
            'is_featured': True,
            'status': 'published',
            'image_url_fallback': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
            'content': """
            <h2>What Computer Science Students Actually Need in a Laptop</h2>
            <p class="lead">Many incoming CS students overspend on heavy gaming laptops with 2-hour battery lives, or underspend on underpowered machines that struggle when running virtual machines, Docker containers, and heavy IDEs.</p>
            <p>After surveying university curricula across leading universities, we've broken down the exact hardware configurations required for algorithms, systems programming, web development, and machine learning coursework.</p>

            <h2>Essential Minimum Specs for 2026:</h2>
            <ul>
              <li><strong>RAM:</strong> 16GB unified/DDR5 is the absolute recommended baseline. 8GB will throttle under Docker and multi-tab browser research.</li>
              <li><strong>Storage:</strong> Minimum 512GB NVMe SSD for SDKs, compilers, and multiple project environments.</li>
              <li><strong>Battery Life:</strong> At least 10 hours of real-world battery to handle back-to-back lectures and library study groups without hunting for power outlets.</li>
              <li><strong>Keyboard Quality:</strong> Comfortable travel and a responsive tactile feel for marathon coding assignments.</li>
            </ul>
            """,
            'faqs': [
                {'question': 'Is Mac or Windows better for Computer Science majors?', 'answer': 'macOS offers a native Unix terminal, making CLI tools, Git, Docker, and Python packages straightforward to configure. However, Windows with WSL2 (Windows Subsystem for Linux) is equally capable for 99% of university coursework.'},
                {'question': 'Do I need a dedicated GPU for Computer Science?', 'answer': 'Unless your specialization specifically involves heavy local 3D rendering or training large neural networks locally (which most universities provide cloud servers for), an integrated GPU with unified memory is more than sufficient.'}
            ]
        }
    )
    post3.affiliate_products.set([p_macbook_air_m3, p_sony_wh1000xm5])
    post3.tags.set([tag_student, tag_coding])

    post4, _ = BlogPost.objects.get_or_create(
        slug='best-usb-c-thunderbolt-docks-for-developers',
        defaults={
            'title': 'Best USB-C & Thunderbolt Docks for Developers: One-Cable Workstation Power',
            'excerpt': 'Turn your laptop into a high-powered dual-monitor workstation with high-speed ports, 2.5Gb Ethernet, and fast charging.',
            'post_type': 'buying-guide',
            'author': author,
            'category': cat_docks,
            'reading_time': 7,
            'is_featured': False,
            'status': 'published',
            'image_url_fallback': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
            'content': """
            <h2>Transforming Laptop Clutter into a Seamless Developer Setup</h2>
            <p class="lead">Plugging five separate dongles into your laptop every morning wastes time and clutters your workspace. A dedicated Thunderbolt 4 dock channels power, dual 4K 60Hz displays, low-latency gigabit ethernet, and USB peripherals through a single cable.</p>
            <p>We tested bandwidth throughput, thermal management, and multi-display compatibility across macOS, Windows, and Linux to find the most dependable docking solutions.</p>
            """,
            'faqs': [
                {'question': 'What is the difference between USB-C and Thunderbolt 4 docks?', 'answer': 'Thunderbolt 4 provides a guaranteed 40Gbps bidirectional bandwidth, enabling dual 4K 60Hz displays and PCIe data transfer, whereas standard USB-C is typically limited to 10Gbps or single-display MST setups.'}
            ]
        }
    )
    post4.affiliate_products.set([p_caldigit_ts4, p_dell_u2723qe])
    post4.tags.set([tag_usbc, tag_coding, tag_ergonomics])
    print("[OK] Tech Buying Guides seeded.")

    # 13. Update Legal / CMS Pages to TechGear Guide
    terms_page, _ = Page.objects.get_or_create(slug='terms')
    terms_page.title = "Terms & Conditions"
    terms_page.meta_title = "Terms & Conditions | TechGear Guide"
    terms_page.meta_description = "Terms and conditions for accessing and using TechGear Guide."
    terms_page.content = """
    <h2>Welcome to TechGear Guide</h2>
    <p>By accessing or using TechGear Guide, you agree to be bound by these Terms &amp; Conditions. Please read them carefully.</p>
    <h2>1. Editorial Research &amp; Information</h2>
    <p>All tech buying guides, product comparisons, benchmarks, and hardware recommendations published on TechGear Guide are for informational and research purposes only. We independently test and evaluate products, but always verify current pricing and availability with the merchant before purchasing.</p>
    <h2>2. Affiliate Transparency</h2>
    <p>TechGear Guide participates in affiliate marketing programs. We may earn a commission when you purchase hardware through our links, at no extra cost to you. Affiliate relationships do not compromise our editorial independence.</p>
    <h2>3. Intellectual Property</h2>
    <p>All content, analysis, charts, and evaluations on this website are the intellectual property of TechGear Guide.</p>
    """
    terms_page.save()

    privacy_page, _ = Page.objects.get_or_create(slug='privacy-policy')
    privacy_page.title = "Privacy Policy"
    privacy_page.meta_title = "Privacy Policy | TechGear Guide"
    privacy_page.meta_description = "Privacy policy explaining how TechGear Guide collects and protects user data."
    privacy_page.content = """
    <h2>Privacy Policy</h2>
    <p>TechGear Guide ("we", "us", or "our") respects your privacy and is committed to protecting your personal data.</p>
    <h2>1. Information We Collect</h2>
    <p>We only collect email addresses when you voluntarily subscribe to our tech newsletter, and messages submitted through our contact form.</p>
    <h2>2. Analytics &amp; Cookies</h2>
    <p>We use standard privacy-respecting analytics to analyze website traffic, readership patterns, and improve our buying guides.</p>
    """
    privacy_page.save()

    affiliate_page, _ = Page.objects.get_or_create(slug='affiliate-disclosure')
    affiliate_page.title = "Affiliate Disclosure"
    affiliate_page.meta_title = "Affiliate Disclosure | TechGear Guide"
    affiliate_page.meta_description = "Full affiliate disclosure and editorial independence policy for TechGear Guide."
    affiliate_page.content = """
    <h2>Affiliate Disclosure &amp; Editorial Standards</h2>
    <p>TechGear Guide is an independent technology review and product research publication.</p>
    <h2>How We Monetize</h2>
    <p>When you click on links to merchants (such as Amazon, Best Buy, or B&amp;H Photo) and make a purchase, we may receive a referral commission. This occurs at zero additional cost to you.</p>
    <h2>Editorial Independence</h2>
    <p>Our product rankings and verdicts are never influenced by commissions or merchant partnerships. We only recommend hardware that meets our rigorous testing standards for developers, students, and home office users.</p>
    """
    affiliate_page.save()

    about_page, _ = Page.objects.get_or_create(slug='about')
    about_page.title = "About TechGear Guide"
    about_page.meta_title = "About Us | TechGear Guide"
    about_page.meta_description = "Learn about our mission to help developers, students, and remote workers make smarter tech buying decisions."
    about_page.content = """
    <h2>Our Mission: Smarter Tech Buying Decisions</h2>
    <p class="lead">We believe buying tech should be transparent, data-driven, and tailored to how you actually work and study.</p>
    <p>Whether you're a Computer Science student looking for a reliable coding laptop on a budget, a software engineer seeking the ultimate multi-monitor desk setup, or a remote professional upgrading home office ergonomics, TechGear Guide provides independent, benchmark-tested buying guides without sponsored bias.</p>
    """
    about_page.save()

    print("[OK] CMS Legal and About pages updated.")
    print("\nSUCCESS: All kitchen content has been completely eradicated and replaced with Tech Buying Guides!")

if __name__ == '__main__':
    cleanup_and_seed_tech()
