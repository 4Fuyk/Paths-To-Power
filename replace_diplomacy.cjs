const fs = require('fs');
let content = fs.readFileSync('src/components/DiplomacyView.tsx', 'utf8');

content = content.replace(/'NATO askeri harcamaları ve otomotiv ticaret gümrük tarifeleri gergisi.'/g, "'NATO military spending and automotive trade tariff tensions.'");
content = content.replace(/'Kuzey Denizi balıkçılık kotaları ve ticaret sınırlamaları anlaşmazlığı.'/g, "'North Sea fishing quotas and trade restrictions dispute.'");
content = content.replace(/'Yarı iletken çip üretim paylaşımları ve teknolojik ihracat engellemeleri rekabeti.'/g, "'Semiconductor chip production sharing and tech export blockades competition.'");
content = content.replace(/'Amazon havzası çevre yönergeleri ve tarımsal gıda ithalat gümrük vergileri gerginliği.'/g, "'Amazon basin environmental regulations and agricultural food import tariffs tension.'");
content = content.replace(/'Süveyş Kanalı kargo geçiş ücretleri ve tarihi eser iade davası ihtilafı.'/g, "'Suez Canal cargo transit fees and historical artifact return lawsuit dispute.'");

fs.writeFileSync('src/components/DiplomacyView.tsx', content, 'utf8');
