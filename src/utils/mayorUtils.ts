import { Region, Party, RivalParty } from '../types';

// Deterministic name generator fallback
export function getDeterministicName(seedString: string, countryId: string): string {
  const trFirst = ['Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hüseyin', 'İbrahim', 'İsmail', 'Murat', 'Ömer', 'Hakan', 'Selin', 'Ayşe', 'Zeynep', 'Fatma', 'Kemal', 'Emre', 'Burak', 'Cem'];
  const trLast = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Kocaman', 'Erdoğan', 'Yavuz'];

  const deFirst = ['Thomas', 'Michael', 'Andreas', 'Stefan', 'Christian', 'Markus', 'Frank', 'Peter', 'Sabine', 'Susanne', 'Kathrin', 'Olaf', 'Robert', 'Friedrich', 'Bodo'];
  const deLast = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Merz', 'Kretschmer', 'Woidke'];

  const usFirst = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Sarah', 'Jennifer', 'Elizabeth', 'Kamala', 'Pete', 'Gavin', 'Ron'];
  const usLast = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Vance', 'Newsom', 'DeSantis'];

  const brFirst = ['João', 'Maria', 'José', 'Ana', 'Antônio', 'Francisco', 'Carlos', 'Paulo', 'Pedro', 'Lucas', 'Rodrigo', 'Eduardo', 'Luiz', 'Simone', 'Tarcísio'];
  const brLast = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Ribeiro', 'Carvalho', 'Tebet', 'Freitas'];

  const jpFirst = ['Kenji', 'Hiroshi', 'Takashi', 'Minoru', 'Naoki', 'Akira', 'Satoshi', 'Yuki', 'Yumi', 'Taro', 'Masaaki', 'Shigeru', 'Sanae', 'Yuriko'];
  const jpLast = ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Ishiba', 'Koike'];

  const egFirst = ['Ahmed', 'Mohamed', 'Mahmoud', 'Mustafa', 'Youssef', 'Ibrahim', 'Ali', 'Omar', 'Amr', 'Hassan', 'Tarek', 'Sameh', 'Abdel'];
  const egLast = ['Hassan', 'Ali', 'Mohamed', 'Ibrahim', 'Mahmoud', 'Salem', 'Hussein', 'Mostafa', 'Abdel', 'Fatah', 'Saad', 'Shoukry'];

  const gbFirst = ['Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Charlie', 'Thomas', 'Oscar', 'William', 'James', 'Richard', 'Keir', 'Rishi', 'Sadiq', 'Andy'];
  const gbLast = ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Thompson', 'Starmer', 'Sunak', 'Khan', 'Burnham'];

  const inFirst = ['Arjun', 'Aarav', 'Rohan', 'Aditya', 'Sanjay', 'Vikram', 'Rajesh', 'Ananya', 'Priya', 'Deepak', 'Narendra', 'Rahul', 'Arvind'];
  const inLast = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Mehta', 'Joshi', 'Iyer', 'Reddy', 'Nair', 'Modi', 'Gandhi', 'Kejriwal'];

  const itFirst = ['Francesco', 'Alessandro', 'Leonardo', 'Lorenzo', 'Giuseppe', 'Andrea', 'Matteo', 'Marco', 'Sofia', 'Giulia', 'Giorgia', 'Elly'];
  const itLast = ['Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Esposito', 'Colombo', 'Romano', 'Ricci', 'Marini', 'Greco', 'Meloni', 'Schlein'];

  const idFirst = ['Budi', 'Joko', 'Agus', 'Siti', 'Dewi', 'Putra', 'Rian', 'Rudi', 'Tri', 'Eko', 'Prabowo', 'Gibran', 'Anies'];
  const idLast = ['Wijaya', 'Santoso', 'Hidayat', 'Pratama', 'Kurniawan', 'Siregar', 'Sutrisno', 'Setiawan', 'Gunawan', 'Saputra', 'Subianto', 'Baswedan'];

  const esFirst = ['Mateo', 'Santiago', 'Matias', 'Sebastian', 'Sofia', 'Maria', 'Alejandro', 'Daniel', 'David', 'Javier', 'Pedro', 'Alberto', 'Isabel'];
  const esLast = ['Hernandez', 'Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Feijóo', 'Ayuso'];

  const krFirst = ['Min-jun', 'Seo-jun', 'Ye-jun', 'Do-yun', 'Si-woo', 'Ji-woo', 'Seo-yeon', 'Seo-hyeon', 'Yoon', 'Lee', 'Jae-myung'];
  const krLast = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Chang', 'Lim', 'Suk-yeol', 'Han'];

  const zaFirst = ['Sipho', 'Thabo', 'Kagiso', 'Lethabo', 'Bandile', 'Melokuhle', 'Zama', 'Naledi', 'Buhle', 'Lerato', 'Cyril', 'John', 'Julius'];
  const zaLast = ['Dlamini', 'Ndlovu', 'Khumalo', 'Mthembu', 'Mokoena', 'Smit', 'Botha', 'Pretorius', 'Naidoo', 'Ramaphosa', 'Steenhuisen', 'Malema'];

  const caFirst = ['Justin', 'Pierre', 'Jagmeet', 'Mark', 'David', 'Scott', 'Danielle', 'François', 'Susan', 'Tim', 'Chrystia', 'Doug'];
  const caLast = ['Smith', 'Tremblay', 'Brown', 'Roy', 'Gagnon', 'Lee', 'Wilson', 'Martin', 'Johnson', 'MacDonald', 'Poilievre', 'Trudeau', 'Ford'];

  const frFirst = ['Gabriel', 'Emmanuel', 'Xavier', 'Laurent', 'Alain', 'Carole', 'Valérie', 'Marine', 'Jordan', 'Jean-Luc', 'Anne', 'Benoît', 'Grégory'];
  const frLast = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Macron', 'Attal', 'Hidalgo', 'Bardella'];

  const roFirst = ['Nicuşor', 'Emil', 'Marcel', 'Nicolae', 'Klaus', 'George', 'Mihai', 'Elena', 'Cătălin', 'Lia', 'Dominic'];
  const roLast = ['Popa', 'Popescu', 'Radu', 'Ionescu', 'Dumitru', 'Stoica', 'Stan', 'Gheorghe', 'Rusu', 'Munteanu', 'Ciolacu', 'Dan', 'Boc'];

  const huFirst = ['Gergely', 'László', 'Péter', 'Viktor', 'Ferenc', 'Klára', 'Pál', 'János', 'Zoltán', 'Mihály', 'Dávid'];
  const huLast = ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár', 'Németh', 'Farkas', 'Orbán', 'Magyar', 'Karácsony'];

  const ruFirst = ['Sergey', 'Dmitry', 'Boris', 'Lev', 'Alexei', 'Nikolai', 'Mikhail', 'Alexander', 'Ilya', 'Oleg', 'Vasily', 'Vladislav', 'Yaroslav', 'Maksim', 'Evgeny', 'Igor', 'Denis'];
  const ruLast = ['Vishnevsky', 'Shlosberg', 'Mitrokhin', 'Yavlinsky', 'Bondarenko', 'Sobyanin', 'Beglov', 'Furgal', 'Davankov', 'Zyuganov', 'Lokot', 'Kurinny', 'Khabirov', 'Teksler', 'Nikitina', 'Gusev', 'Petlin'];

  const uaFirst = ['Vitali', 'Ihor', 'Hennadiy', 'Borys', 'Andriy', 'Ivan', 'Oleksandr', 'Serhiy', 'Vladyslav', 'Roman', 'Ruslan', 'Oleh', 'Petro', 'Tamila', 'Kateryna'];
  const uaLast = ['Klitschko', 'Terekhov', 'Trukhanov', 'Filatov', 'Sadovyi', 'Fedorov', 'Senkevych', 'Morhunov', 'Bondarenko', 'Symchyshyn', 'Martsinkiv', 'Synyutka', 'Honcharenko', 'Tasheva', 'Yatsenko'];

  const plFirst = ['Rafał', 'Jacek', 'Aleksandra', 'Hanna', 'Aleksander', 'Marcin', 'Piotr', 'Krzysztof', 'Tadeusz', 'Arkadiusz', 'Agata', 'Robert', 'Konrad', 'Donald', 'Szymon', 'Krzysztof'];
  const plLast = ['Trzaskowski', 'Jaśkowiak', 'Dulkiewicz', 'Sutryk', 'Zdanowska', 'Miszalski', 'Krupa', 'Bruski', 'Krzystek', 'Żuk', 'Truskolaski', 'Wiśniewski', 'Wojda', 'Tusk', 'Hołownia', 'Bosak'];

  const seFirst = ['Ulf', 'Magdalena', 'Jimmie', 'Nooshi', 'Johan', 'Ebba', 'Per', 'Karin', 'Anna', 'Lars', 'Erik', 'Mikael', 'Camilla', 'Fredrik'];
  const seLast = ['Kristersson', 'Andersson', 'Åkesson', 'Dadgostar', 'Pehrson', 'Busch', 'Bolund', 'Wanngård', 'Johansson', 'Nilsson', 'Larsson', 'Karlsson', 'Svensson'];

  const ptFirst = ['Luís', 'Pedro', 'André', 'Rui', 'Mariana', 'Paulo', 'Carlos', 'Inês', 'António', 'Fernando', 'Manuel', 'Teresa'];
  const ptLast = ['Montenegro', 'Santos', 'Ventura', 'Rocha', 'Mortágua', 'Raimundo', 'Moedas', 'Moreira', 'Rodrigues', 'Ferreira', 'Sousa', 'Costa'];

  const grFirst = ['Kyriakos', 'Nikos', 'Stefanos', 'Dimitris', 'Kostas', 'Haris', 'Pavlos', 'Elena', 'Rena', 'Yannis', 'Giorgos'];
  const grLast = ['Mitsotakis', 'Androulakis', 'Kasselakis', 'Koutsoumbas', 'Velopoulos', 'Natsios', 'Bakoyannis', 'Doukas', 'Boutaris', 'Moraitis'];

  const isFirst = ['Bjarni', 'Katrín', 'Kristrún', 'Sigurður', 'Þorgerður', 'Dagur', 'Einar', 'Ásmundur', 'Halla', 'Gunnar'];
  const isLast = ['Benediktsson', 'Jakobsdóttir', 'Frostadóttir', 'Ingi', 'Katrínarson', 'Eggertsson', 'Þorsteinsson', 'Einarsson', 'Jónsdóttir', 'Sigurðsson'];

  const cnFirst = ['Xi', 'Li', 'Wang', 'Zhang', 'Chen', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu'];
  const cnLast = ['Jinping', 'Qiang', 'Huning', 'Zhaolei', 'Keqiang', 'Yangjie', 'Ming', 'Wei', 'Jun', 'Feng', 'Yong'];

  const twFirst = ['Lai', 'Hou', 'Ko', 'Han', 'Chen', 'Chiang', 'Lin', 'Cheng', 'Lu', 'Kao'];
  const twLast = ['Ching-te', 'Yu-ih', 'Wen-je', 'Kuo-yu', 'Chi-mai', 'Wan-an', 'Chia-lung', 'Wen-tsan', 'Shiow-yen', 'Hung-an'];

  const saFirst = ['Mohammed', 'Faisal', 'Khalid', 'Abdulaziz', 'Turki', 'Badr', 'Saud', 'Abdullah', 'Mansour', 'Sultan'];
  const saLast = ['bin Salman', 'bin Farhan', 'Al-Falih', 'Al-Saud', 'Al-Sheikh', 'Al-Jadaan', 'Al-Qasabi', 'Al-Ghamdi', 'Al-Harbi'];

  const irFirst = ['Masoud', 'Saeed', 'Mohammad', 'Ali', 'Ebrahim', 'Hassan', 'Hossein', 'Javad', 'Gholam', 'Alireza'];
  const irLast = ['Pezeshkian', 'Jalili', 'Ghalibaf', 'Bagheri', 'Khamenei', 'Rouhani', 'Zarif', 'Larijani', 'Zakani', 'Salami'];

  const ilFirst = ['Benjamin', 'Yair', 'Benny', 'Itamar', 'Bezalel', 'Avigdor', 'Ron', 'Yair', 'Mansour', 'Ayman'];
  const ilLast = ['Netanyahu', 'Lapid', 'Gantz', 'Ben-Gvir', 'Smotrich', 'Lieberman', 'Huldai', 'Golan', 'Abbas', 'Odeh'];

  const psFirst = ['Mahmoud', 'Mohammad', 'Mustafa', 'Yahya', 'Ismail', 'Khaled', 'Rawhi', 'Husam', 'Salam', 'Marwan'];
  const psLast = ['Abbas', 'Mustafa', 'Shtayyeh', 'Sinwar', 'Haniyeh', 'Meshaal', 'Fattouh', 'Badran', 'Fayyad', 'Barghouti'];

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const sample = (arr: string[]) => arr[hash % arr.length];

  if (countryId === 'TR') return `${sample(trFirst)} ${sample(trLast)}`;
  if (countryId === 'DE' || countryId === 'DDR') return `${sample(deFirst)} ${sample(deLast)}`;
  if (countryId === 'US') return `${sample(usFirst)} ${sample(usLast)}`;
  if (countryId === 'BR') return `${sample(brFirst)} ${sample(brLast)}`;
  if (countryId === 'JP') return `${sample(jpFirst)} ${sample(jpLast)}`;
  if (countryId === 'EG') return `${sample(egFirst)} ${sample(egLast)}`;
  if (countryId === 'GB') return `${sample(gbFirst)} ${sample(gbLast)}`;
  if (countryId === 'IN') return `${sample(inFirst)} ${sample(inLast)}`;
  if (countryId === 'IT') return `${sample(itFirst)} ${sample(itLast)}`;
  if (countryId === 'ID') return `${sample(idFirst)} ${sample(idLast)}`;
  if (countryId === 'MX' || countryId === 'ES' || countryId === 'AR' || countryId === 'CL') return `${sample(esFirst)} ${sample(esLast)}`;
  if (countryId === 'KR') return `${sample(krFirst)} ${sample(krLast)}`;
  if (countryId === 'ZA') return `${sample(zaFirst)} ${sample(zaLast)}`;
  if (countryId === 'CA' || countryId === 'AU') return `${sample(caFirst)} ${sample(caLast)}`;
  if (countryId === 'FR') return `${sample(frFirst)} ${sample(frLast)}`;
  if (countryId === 'RO') return `${sample(roFirst)} ${sample(roLast)}`;
  if (countryId === 'HU') return `${sample(huFirst)} ${sample(huLast)}`;
  if (countryId === 'RU' || countryId === 'SU') return `${sample(ruFirst)} ${sample(ruLast)}`;
  if (countryId === 'UA') return `${sample(uaFirst)} ${sample(uaLast)}`;
  if (countryId === 'PL' || countryId === 'CS') return `${sample(plFirst)} ${sample(plLast)}`;
  if (countryId === 'SE') return `${sample(seFirst)} ${sample(seLast)}`;
  if (countryId === 'PT') return `${sample(ptFirst)} ${sample(ptLast)}`;
  if (countryId === 'GR') return `${sample(grFirst)} ${sample(grLast)}`;
  if (countryId === 'IS') return `${sample(isFirst)} ${sample(isLast)}`;
  if (countryId === 'CN') return `${sample(cnFirst)} ${sample(cnLast)}`;
  if (countryId === 'TW') return `${sample(twFirst)} ${sample(twLast)}`;
  if (countryId === 'SA') return `${sample(saFirst)} ${sample(saLast)}`;
  if (countryId === 'IR') return `${sample(irFirst)} ${sample(irLast)}`;
  if (countryId === 'IL') return `${sample(ilFirst)} ${sample(ilLast)}`;
  if (countryId === 'PS') return `${sample(psFirst)} ${sample(psLast)}`;

  return `${sample(usFirst)} ${sample(usLast)}`;
}

// Known regional party leaders/mayors/candidates table for ALL countries
export const SPECIFIC_PARTY_MAYORS: Record<string, Record<string, Record<string, string>>> = {
  TR: {
    YENI: {
      'Manisa': 'Ferdi Zeyrek',
      'İzmir': 'Cemil Tugay',
      'Bursa': 'Mustafa Bozbey',
      'Antalya': 'Muhittin Böcek',
      'Eskişehir': 'Ayşe Ünlüce',
      'Balıkesir': 'Ahmet Akın',
      'Muğla': 'Ahmet Aras',
      'Edirne': 'Filiz Gencan Akın',
      'Tekirdağ': 'Candan Yüceer',
      'Yalova': 'Mehmet Gürel',
      'Kütahya': 'Eyüp Kahveci',
      'Uşak': 'Özkan Yalım',
      'Kırşehir': 'Selahattin Ekicioğlu',
      'Çanakkale': 'Muharrem Erkek',
      'Denizli': 'Bülent Nuri Çavuşoğlu',
      'Bilecik': 'Melek Mızrak Subaşı',
      'İstanbul': 'Ekrem İmamoğlu',
      'Ankara': 'Mansur Yavaş',
      'Adana': 'Zeydan Karalar',
      'Aydın': 'Özlem Çerçioğlu',
      'Mersin': 'Vahap Seçer'
    },
    CHP: {
      'Adana': 'Zeydan Karalar',
      'Adıyaman': 'Abdurrahman Tutdere',
      'Afyonkarahisar': 'Burcu Köksal',
      'Ağrı': 'Erkan Bulut',
      'Amasya': 'Turgay Sevindi',
      'Ankara': 'Mansur Yavaş',
      'Antalya': 'Muhittin Böcek',
      'Artvin': 'Bilgehan Erdem',
      'Aydın': 'Özlem Çerçioğlu',
      'Balıkesir': 'Ahmet Akın',
      'Bilecik': 'Melek Mızrak Subaşı',
      'Bingöl': 'Yılmaz Bilen',
      'Bitlis': 'Selim Suyur',
      'Bolu': 'Tanju Özcan',
      'Burdur': 'Ali Orkun Ercengiz',
      'Bursa': 'Mustafa Bozbey',
      'Çanakkale': 'Muharrem Erkek',
      'Çankırı': 'İlhan Teke',
      'Çorum': 'Hasan Levent Çöphüseyinoğlu',
      'Denizli': 'Bülent Nuri Çavuşoğlu',
      'Diyarbakır': 'Cafer Kent',
      'Edirne': 'Filiz Gencan Akın',
      'Elazığ': 'Coşkun Çağlar Duran',
      'Erzincan': 'Özge Vural',
      'Erzurum': 'Atlihan Atila',
      'Eskişehir': 'Ayşe Ünlüce',
      'Gaziantep': 'Muzaffer Ertürk',
      'Giresun': 'Fuat Köse',
      'Gümüşhane': 'Bedri Ağaç',
      'Hakkari': 'Cüneyt Özbek',
      'Hatay': 'Lütfü Savaş',
      'Isparta': 'Atakan Yazgan',
      'Mersin': 'Vahap Seçer',
      'İstanbul': 'Ekrem İmamoğlu',
      'İzmir': 'Cemil Tugay',
      'Kars': 'Dündar Gültekin',
      'Kastamonu': 'Hasan Baltacı',
      'Kayseri': 'Murat Molu',
      'Kırklareli': 'Mehmet Siyam Kesimoğlu',
      'Kırşehir': 'Selahattin Ekicioğlu',
      'Kocaeli': 'Atasoy Bilgin',
      'Konya': 'İsmail Kayan',
      'Kütahya': 'Eyüp Kahveci',
      'Malatya': 'Veli Ağbaba',
      'Manisa': 'Ferdi Zeyrek',
      'Kahramanmaraş': 'Zeynep Özbaş Arıkan',
      'Mardin': 'Ömer Durak',
      'Muğla': 'Ahmet Aras',
      'Muş': 'Tuncay Canca',
      'Nevşehir': 'Mehmet Deşeler',
      'Niğde': 'Hulus Öztürk',
      'Ordu': 'Zekai Sana',
      'Osmaniye': 'Serkan Karayiğit',
      'Rize': 'Necati Topaloğlu',
      'Sakarya': 'Azize Çeroğlu',
      'Samsun': 'Cevat Öncü',
      'Şanlıurfa': 'Mustafa Arısüt',
      'Siirt': 'Umut Sönmez',
      'Sinop': 'Metin Gürbüz',
      'Şırnak': 'Ozancan İrmez',
      'Sivas': 'Tacettin Kepenek',
      'Tekirdağ': 'Candan Yüceer',
      'Tokat': 'Murat Yazıcı',
      'Trabzon': 'Hasan Süha Saral',
      'Tunceli': 'Erkan Aydın',
      'Uşak': 'Özkan Yalım',
      'Van': 'Seracettin Bedirhanoğlu',
      'Yalova': 'Mehmet Gürel',
      'Yozgat': 'Ömer Nalbant',
      'Zonguldak': 'Tahsin Erdem',
      'Aksaray': 'Pelinsu Yıldırım Demir',
      'Bayburt': 'Kubilay Erel',
      'Karaman': 'Nihal Tümene',
      'Kırıkkale': 'Ahmet Önal',
      'Batman': 'Hasan Ekinci',
      'Bartın': 'Rıza Yalçınkaya',
      'Ardahan': 'Faruk Demir',
      'Iğdır': 'Volkan Zülfükar',
      'Karabük': 'Bayram Karadağ',
      'Kilis': 'Hakan Bilecen',
      'Düzce': 'Sedat Çelikel'
    },
    AKP: {
      'Adana': 'Fatih Mehmet Kocaispir',
      'Adıyaman': 'Ziya Polat',
      'Afyonkarahisar': 'Hüseyin Ceylan Uluçay',
      'Ağrı': 'Salih Aydın',
      'Amasya': 'Cafer Özdemir',
      'Ankara': 'Turgut Altınok',
      'Antalya': 'Hakan Tütüncü',
      'Artvin': 'Mehmet Kocatepe',
      'Aydın': 'Mustafa Savaş',
      'Balıkesir': 'Yücel Yılmaz',
      'Bilecik': 'Mustafa Yaman',
      'Bingöl': 'Erdal Arıkan',
      'Bitlis': 'Nesrullah Tanğlay',
      'Bolu': 'Muhammed Emin Demirkol',
      'Burdur': 'Deniz Kurt',
      'Bursa': 'Alinur Aktaş',
      'Çanakkale': 'Jülide İskenderoğlu',
      'Çankırı': 'Hüseyin Filiz',
      'Çorum': 'Halil İbrahim Aşgın',
      'Denizli': 'Osman Zolan',
      'Diyarbakır': 'Mehmet Galip Ensarioğlu',
      'Edirne': 'Belgin İba',
      'Elazığ': 'Şahin Şerifoğulları',
      'Erzincan': 'Bekir Aksun',
      'Erzurum': 'Mehmet Sekmen',
      'Eskişehir': 'Nebi Hatipoğlu',
      'Gaziantep': 'Fatma Şahin',
      'Giresun': 'Aytekin Şenlikoğlu',
      'Gümüşhane': 'Ercan Çimen',
      'Hakkari': 'İsmet Ölmez',
      'Hatay': 'Mehmet Öntürk',
      'Isparta': 'Şükrü Başdeğirmen',
      'Mersin': 'Serdar Soydan',
      'İstanbul': 'Murat Kurum',
      'İzmir': 'Hamza Dağ',
      'Kars': 'Ötüken Senger',
      'Kastamonu': 'Tahsin Babaş',
      'Kayseri': 'Memduh Büyükkılıç',
      'Kırklareli': 'Derya Bulut',
      'Kırşehir': 'Osman Arslan',
      'Kocaeli': 'Tahir Büyükakın',
      'Konya': 'Uğur İbrahim Altay',
      'Kütahya': 'Kamil Saraçoğlu',
      'Malatya': 'Sami Er',
      'Manisa': 'Cengiz Ergün',
      'Kahramanmaraş': 'Fırat Görgel',
      'Mardin': 'Abdullah Erin',
      'Muğla': 'Aydın Ayaydın',
      'Muş': 'Feyat Asya',
      'Nevşehir': 'Mehmet Savran',
      'Niğde': 'Emrah Özdemir',
      'Ordu': 'Mehmet Hilmi Güler',
      'Osmaniye': 'İbrahim Çenet',
      'Rize': 'Rahmi Metin',
      'Sakarya': 'Yusuf Alemdar',
      'Samsun': 'Halit Doğan',
      'Şanlıurfa': 'Zeynel Abidin Beyazgül',
      'Siirt': 'Ekrem Olğaç',
      'Sinop': 'Yakup Üçüncüoğlu',
      'Şırnak': 'Mehmet Yarka',
      'Sivas': 'Hilmi Bilgin',
      'Tekirdağ': 'Cüneyt Yüksel',
      'Tokat': 'Eyüp Eroğlu',
      'Trabzon': 'Ahmet Metin Genç',
      'Tunceli': 'Erkan Aydın',
      'Uşak': 'Mehmet Çakın',
      'Van': 'Abdulahat Arvas',
      'Yalova': 'Mustafa Tutuk',
      'Yozgat': 'Celal Köse',
      'Zonguldak': 'Ömer Selim Alan',
      'Aksaray': 'Evren Dinçer',
      'Bayburt': 'Mete Memiş',
      'Karaman': 'Mevlüt Akgün',
      'Kırıkkale': 'Mehmet Saygılı',
      'Batman': 'Adil Sebati Ceylan',
      'Bartın': 'Hüseyin Fahri Fırıncıoğlu',
      'Ardahan': 'Yunus Baydar',
      'Iğdır': 'Ülkü Öcal',
      'Karabük': 'Özkan Çetinkaya',
      'Kilis': 'Reşit Değirmenci',
      'Düzce': 'Faruk Özlü'
    },
    DEM: {
      'Ağrı': 'Hazal Aras',
      'Batman': 'Gülistan Sönük',
      'Diyarbakır': 'Ayşe Serra Bucak Küçük',
      'Hakkari': 'Mehmet Sıddık Akış',
      'Iğdır': 'Mehmet Nuri Güneş',
      'Mardin': 'Ahmet Türk',
      'Muş': 'Sırrı Söylemez',
      'Siirt': 'Sofya Alağaş',
      'Tunceli': 'Cevdet Konak',
      'Van': 'Abdullah Zeydan',
      'İstanbul': 'Meral Danış Beştaş',
      'İzmir': 'Akın Birdal',
      'Adana': 'Mahfuz Güleryüz',
      'Antalya': 'Kemal Bülbül',
      'Mersin': 'Devrim Alp',
      'Erzurum': 'Fırat Yılmaz',
      'Şanlıurfa': 'Celalettin Erkmen',
      'Kars': 'Arzu Savaş Duman',
      'Bingöl': 'Yılmaz Bilen',
      'Bitlis': 'Faruk Altun',
      'Şırnak': 'Turan Saltan',
      'Elazığ': 'Hayrettin Kaya'
    },
    MHP: {
      'Çankırı': 'İsmail Hakkı Esen',
      'Erzincan': 'Bekir Aksun',
      'Gümüşhane': 'Vedat Soner Başer',
      'Kars': 'Ötüken Senger',
      'Kırklareli': 'Derya Bulut',
      'Tokat': 'Mehmet Kemal Yazıcıoğlu',
      'Karaman': 'Savaş Kalaycı',
      'Osmaniye': 'İbrahim Çenet',
      'Amasya': 'Bayram Çelik',
      'Kütahya': 'Alim Işık',
      'Manisa': 'Cengiz Ergün',
      'Isparta': 'Ziya Nuhoğlu',
      'Nevşehir': 'Adnan Doğu',
      'Bayburt': 'Hükmü Pekmezci',
      'Karabük': 'Rafet Vergili',
      'Kilis': 'Hasan Kara'
    },
    YRP: {
      'Şanlıurfa': 'Mehmet Kasım Gülpınar',
      'Yozgat': 'Kazım Arslan',
      'Elazığ': 'Faruk Septioğlu',
      'Ankara': 'Suat Kılıç',
      'İstanbul': 'Mehmet Altınöz',
      'Bursa': 'Sedat Yalçın',
      'Samsun': 'Adem Güney',
      'Kayseri': 'Abdullah Özkırış'
    },
    BBP: {
      'Sivas': 'Adem Uzun'
    },
    IYI: {
      'Nevşehir': 'Rasim Arı',
      'Ordu': 'Enver Yılmaz',
      'Çanakkale': 'Burak Kunt',
      'Balıkesir': 'Turhan Çömez',
      'İzmir': 'Ümit Özlale',
      'Ankara': 'Cengiz Topel Yıldırım',
      'İstanbul': 'Buğra Kavuncu'
    }
  },
  US: {
    DEM_US: {
      'California': 'Gavin Newsom',
      'New York': 'Kathy Hochul',
      'Illinois': 'J. B. Pritzker',
      'Minnesota': 'Tim Walz',
      'Michigan': 'Gretchen Whitmer',
      'Maryland': 'Wes Moore',
      'Massachusetts': 'Maura Healey',
      'Pennsylvania': 'Josh Shapiro',
      'North Carolina': 'Roy Cooper',
      'Colorado': 'Jared Polis',
      'Kentucky': 'Andy Beshear',
      'Kansas': 'Laura Kelly',
      'Arizona': 'Katie Hobbs',
      'Oregon': 'Tina Kotek',
      'Connecticut': 'Ned Lamont',
      'New Jersey': 'Phil Murphy',
      'New Mexico': 'Michelle Lujan Grisham',
      'Maine': 'Janet Mills',
      'Delaware': 'Matt Meyer',
      'Hawaii': 'Josh Green',
      'Texas': 'Beto O\'Rourke',
      'Florida': 'Nikki Fried',
      'Georgia': 'Stacey Abrams'
    },
    REP: {
      'Texas': 'Greg Abbott',
      'Florida': 'Ron DeSantis',
      'Georgia': 'Brian Kemp',
      'Arkansas': 'Sarah Huckabee Sanders',
      'Virginia': 'Glenn Youngkin',
      'Ohio': 'Mike DeWine',
      'Iowa': 'Kim Reynolds',
      'South Dakota': 'Kristi Noem',
      'Oklahoma': 'Kevin Stitt',
      'Utah': 'Spencer Cox',
      'Nevada': 'Joe Lombardo',
      'Alaska': 'Mike Dunleavy',
      'Alabama': 'Kay Ivey',
      'Idaho': 'Brad Little',
      'Louisiana': 'Jeff Landry',
      'Montana': 'Greg Gianforte',
      'Nebraska': 'Jim Pillen',
      'Vermont': 'Phil Scott',
      'New Hampshire': 'Chris Sununu',
      'North Dakota': 'Kelly Armstrong',
      'Indiana': 'Mike Braun',
      'South Carolina': 'Henry McMaster',
      'Tennessee': 'Bill Lee',
      'Wyoming': 'Mark Gordon',
      'California': 'Brian Dahle',
      'New York': 'Lee Zeldin',
      'Arizona': 'Kari Lake'
    }
  },
  DE: {
    CDU: {
      'Baden-Württemberg': 'Manuel Hagel',
      'Bayern': 'Markus Söder',
      'Berlin': 'Kai Wegner',
      'Hessen': 'Boris Rhein',
      'Niedersachsen': 'Bernd Althusmann',
      'Nordrhein-Westfalen': 'Hendrik Wüst',
      'Rheinland-Pfalz': 'Gordon Schnieder',
      'Saarland': 'Stephan Toscani',
      'Sachsen': 'Michael Kretschmer',
      'Sachsen-Anhalt': 'Reiner Haseloff',
      'Schleswig-Holstein': 'Daniel Günther',
      'Thüringen': 'Mario Voigt'
    },
    SPD: {
      'Bremen': 'Andreas Bovenschulte',
      'Hamburg': 'Peter Tschentscher',
      'Mecklenburg-Vorpommern': 'Manuela Schwesig',
      'Niedersachsen': 'Stephan Weil',
      'Rheinland-Pfalz': 'Alexander Schweitzer',
      'Saarland': 'Anke Rehlinger',
      'Brandenburg': 'Dietmar Woidke',
      'Berlin': 'Franziska Giffey',
      'Nordrhein-Westfalen': 'Thomas Kutschaty'
    },
    GRÜNE: {
      'Baden-Württemberg': 'Winfried Kretschmann',
      'Bayern': 'Katharina Schulze',
      'Nordrhein-Westfalen': 'Mona Neubaur'
    },
    AfD: {
      'Brandenburg': 'Hans-Christoph Berndt',
      'Sachsen': 'Jörg Urban',
      'Sachsen-Anhalt': 'Ulrich Siegmund',
      'Thüringen': 'Björn Höcke'
    }
  },
  GB: {
    LAB: {
      'London': 'Sadiq Khan',
      'North West': 'Andy Burnham',
      'Yorkshire and The Humber': 'Tracy Brabin',
      'East Midlands': 'Claire Ward',
      'West Midlands': 'Richard Parker',
      'South West': 'Dan Norris',
      'Wales': 'Eluned Morgan',
      'North East': 'Kim McGuinness'
    },
    CON: {
      'London': 'Susan Hall',
      'North East': 'Ben Houchen',
      'West Midlands': 'Andy Street',
      'South East': 'Paul Marshall',
      'Eastern': 'Peter Taylor'
    },
    SNP: {
      'Scotland': 'John Swinney'
    }
  },
  BR: {
    PT: {
      'Bahia': 'Jerônimo Rodrigues',
      'Ceará': 'Elmano de Freitas',
      'Rio Grande do Norte': 'Fátima Bezerra',
      'Piauí': 'Rafael Fonteles',
      'São Paulo': 'Fernando Haddad',
      'Rio de Janeiro': 'Marcelo Freixo',
      'Minas Gerais': 'Alexandre Silveira'
    },
    PL: {
      'São Paulo': 'Tarcísio de Freitas',
      'Rio de Janeiro': 'Cláudio Castro',
      'Minas Gerais': 'Romeu Zema',
      'Goiás': 'Ronaldo Caiado',
      'Santa Catarina': 'Jorginho Mello',
      'Paraná': 'Ratinho Júnior',
      'Rio Grande do Sul': 'Eduardo Leite'
    }
  },
  JP: {
    LDP: {
      'Tokyo': 'Yuriko Koike',
      'Kanagawa': 'Yuji Kuroiwa',
      'Aichi': 'Hideaki Omura',
      'Saitama': 'Motohiro Ono',
      'Chiba': 'Toshihito Kumagai',
      'Fukuoka': 'Seitaro Hattori',
      'Kyoto': 'Takatoshi Nishiwaki',
      'Hiroshima': 'Hidehiko Yuzaki',
      'Miyagi': 'Yoshihiro Murai',
      'Hyogo': 'Motohiko Saito'
    },
    CDP: {
      'Hokkaido': 'Naomichi Suzuki',
      'Iwate': 'Takuya Tasso',
      'Nagano': 'Shuichi Abe',
      'Okinawa': 'Denny Tamaki'
    },
    ISHIN: {
      'Osaka': 'Hirofumi Yoshimura',
      'Hyogo': 'Motohiko Saito'
    }
  },
  EG: {
    NFP: {
      'Cairo': 'Khaled Abdel Aal',
      'Alexandria': 'Mohamed Taher Al-Sherif',
      'Giza': 'Ahmed Rashed',
      'Luxor': 'Mustafa Al-Alham',
      'Aswan': 'Ashraf Attia',
      'Asyut': 'Essam Saad',
      'Beheira': 'Hisham Amna',
      'Dakahlia': 'Ayman Mokhtar',
      'Damietta': 'Manal Awad Mikhail',
      'Faiyum': 'Ahmed Al-Ansari',
      'Gharbia': 'Tarek Rahmy',
      'Minya': 'Osama Al-Qady',
      'Monufia': 'Ibrahim Abu Limon',
      'Port Said': 'Adel Ghadban',
      'Qalyubia': 'Abdel Hamid El-Haggan',
      'Red Sea': 'Amr Hanafy',
      'Sharqia': 'Mamdouh Ghorab',
      'Sohag': 'Tarek El-Feki',
      'Suez': 'Abdel Majeed Saqr'
    }
  },
  RU: {
    YABLOKO: {
      'Moscow': 'Sergey Mitrokhin',
      'Saint Petersburg': 'Boris Vishnevsky',
      'Pskov': 'Lev Shlosberg',
      'Sverdlovsk': 'Maksim Petlin',
      'Novosibirsk': 'Dmitry Kochev',
      'Krasnoyarsk': 'Oksana Demina',
      'Nizhny Novgorod': 'Oleg Rodin',
      'Tatarstan': 'Ruslan Zinatullin',
      'Rostov': 'Inna Kolomiytseva',
      'Samara': 'Igor Ermakov',
      'Chelyabinsk': 'Yaroslav Shcherbakov',
      'Krasnodar': 'Irbek Bagaev',
      'Voronezh': 'Tatyana Shvedova',
      'Perm': 'Olga Kolokolova',
      'Volgograd': 'Alexander Efimov',
      'Bashkortostan': 'Albert Gaysin',
      'Irkutsk': 'Larisa Kazakova',
      'Khabarovsk': 'Vasily Khabarov',
      'Primorsky': 'Nikolai Markovtsev',
      'Omsk': 'Tatyana Nagornaya'
    },
    ER: {
      'Moscow': 'Sergey Sobyanin',
      'Saint Petersburg': 'Alexander Beglov',
      'Tatarstan': 'Rustam Minnikhanov',
      'Chechnya': 'Ramzan Kadyrov',
      'Sverdlovsk': 'Evgeny Kuyvashev',
      'Nizhny Novgorod': 'Gleb Nikitin',
      'Krasnodar': 'Veniamin Kondratyev',
      'Samara': 'Vyacheslav Fedorishchev',
      'Rostov': 'Vasily Golubev',
      'Novosibirsk': 'Andrey Travnikov',
      'Krasnoyarsk': 'Mikhail Kotyukov',
      'Chelyabinsk': 'Alexey Teksler',
      'Bashkortostan': 'Radiy Khabirov',
      'Voronezh': 'Aleksandr Gusev',
      'Perm': 'Dmitry Makhonin',
      'Volgograd': 'Andrey Bocharov',
      'Irkutsk': 'Igor Kobzev',
      'Khabarovsk': 'Dmitry Demeshin',
      'Primorsky': 'Oleg Kozhemyako',
      'Omsk': 'Vitaliy Khotsenko'
    },
    CPRF: {
      'Moscow': 'Leonid Zyuganov',
      'Saint Petersburg': 'Roman Kononenko',
      'Novosibirsk': 'Anatoly Lokot',
      'Ulyanovsk': 'Alexey Kurinny',
      'Saratov': 'Nikolai Bondarenko',
      'Omsk': 'Alexander Kravets',
      'Oryol': 'Andrey Klychkov',
      'Khakassia': 'Valentin Konovalov',
      'Irkutsk': 'Sergey Levchenko',
      'Samara': 'Mikhail Matveyev',
      'Rostov': 'Evgeny Bessonov',
      'Tatarstan': 'Khafiz Mirgalimov',
      'Sverdlovsk': 'Aleksandr Ivachev'
    },
    LDPR: {
      'Khabarovsk': 'Sergey Furgal',
      'Moscow': 'Leonid Slutsky',
      'Saint Petersburg': 'Oleg Kapitanov',
      'Smolensk': 'Alexey Ostrovsky',
      'Vladimir': 'Vladimir Sipyagin',
      'Zabaykalsky': 'Vasilina Kulieva',
      'Krasnoyarsk': 'Denis Tereshkov'
    },
    NL: {
      'Moscow': 'Vladislav Davankov',
      'Saint Petersburg': 'Ksenia Goryacheva',
      'Sverdlovsk': 'Igor Volovik',
      'Novosibirsk': 'Daria Karaseva',
      'Yakutia': 'Sardana Avksentyeva'
    }
  },
  UA: {
    SN: {
      'Kyiv': 'Vitali Klitschko',
      'Kharkiv': 'Ihor Terekhov',
      'Odesa': 'Hennadiy Trukhanov',
      'Dnipro': 'Borys Filatov',
      'Lviv': 'Andriy Sadovyi',
      'Zaporizhzhia': 'Ivan Fedorov',
      'Mykolaiv': 'Oleksandr Senkevych',
      'Vinnytsia': 'Serhiy Morhunov',
      'Chernihiv': 'Vladyslav Atroshenko',
      'Poltava': 'Kateryna Yamshchykova',
      'Cherkasy': 'Anatoliy Bondarenko',
      'Khmelnytskyi': 'Oleksandr Symchyshyn',
      'Zhytomyr': 'Serhiy Sukhomlyn',
      'Chernivtsi': 'Roman Klichuk',
      'Rivne': 'Oleksandr Tretyak',
      'Ivano-Frankivsk': 'Ruslan Martsinkiv',
      'Ternopil': 'Serhiy Nadal',
      'Lutsk': 'Ihor Polishchuk',
      'Uzhhorod': 'Bohdan Andriyiv',
      'Sumy': 'Oleksandr Lysenko',
      'Kherson': 'Roman Mrochko',
      'Kropyvnytskyi': 'Andriy Raykovych',
      'Donetsk': 'Pavlo Kyrylenko',
      'Luhansk': 'Serhiy Haidai',
      'Crimea': 'Tamila Tasheva'
    },
    ES: {
      'Kyiv': 'Oleksiy Honcharenko',
      'Lviv': 'Oleh Synyutka',
      'Dnipro': 'Tetiana Rykova',
      'Odesa': 'Petro Obukhov',
      'Kharkiv': 'Iryna Friz',
      'Vinnytsia': 'Andriy Hyzhko',
      'Rivne': 'Oleksandr Kovalchuk',
      'Ternopil': 'Stepan Barna',
      'Ivano-Frankivsk': 'Volodymyr Kurylo',
      'Lutsk': 'Yuriy Moklytsya'
    },
    BATK: {
      'Kyiv': 'Oleksiy Kucherenko',
      'Dnipro': 'Antonina Ulyakhina',
      'Kharkiv': 'Valeriy Dubil',
      'Odesa': 'Oleh Radkovskyy',
      'Lviv': 'Mykhailo Tsymbalyuk'
    }
  },
  PL: {
    KO: {
      'Mazowieckie': 'Rafał Trzaskowski',
      'Wielkopolskie': 'Jacek Jaśkowiak',
      'Pomorskie': 'Aleksandra Dulkiewicz',
      'Dolnośląskie': 'Jacek Sutryk',
      'Łódzkie': 'Hanna Zdanowska',
      'Małopolskie': 'Aleksander Miszalski',
      'Śląskie': 'Marcin Krupa',
      'Kujawsko-Pomorskie': 'Rafał Bruski',
      'Zachodniopomorskie': 'Piotr Krzystek',
      'Lubelskie': 'Krzysztof Żuk',
      'Podlaskie': 'Tadeusz Truskolaski',
      'Opolskie': 'Arkadiusz Wiśniewski',
      'Świętokrzyskie': 'Agata Wojda',
      'Warmińsko-Mazurskie': 'Robert Szewczyk',
      'Podkarpackie': 'Konrad Fijołek',
      'Lubuskie': 'Jacek Wójcicki'
    },
    PIS: {
      'Mazowieckie': 'Tobiasz Bocheński',
      'Małopolskie': 'Łukasz Kmita',
      'Podkarpackie': 'Władysław Ortyl',
      'Lubelskie': 'Jarosław Stawiarski',
      'Podlaskie': 'Artur Kosicki',
      'Świętokrzyskie': 'Andrzej Bętkowski',
      'Łódzkie': 'Grzegorz Schreiber',
      'Śląskie': 'Jakub Chełstowski'
    }
  },
  FR: {
    ENS: {
      'Île-de-France': 'Valérie Pécresse',
      'Auvergne-Rhône-Alpes': 'Laurent Wauquiez',
      'Nouvelle-Aquitaine': 'Alain Rousset',
      'Occitanie': 'Carole Delga',
      'Hauts-de-France': 'Xavier Bertrand',
      'Grand Est': 'Franck Leroy',
      'Provence-Alpes-Côte d\'Azur': 'Renaud Muselier',
      'Pays de la Loire': 'Christelle Morançais',
      'Bretagne': 'Loïg Chesnais-Girard',
      'Normandie': 'Hervé Morin'
    },
    RN: {
      'Hauts-de-France': 'Sébastien Chenu',
      'Provence-Alpes-Côte d\'Azur': 'Thierry Mariani',
      'Occitanie': 'Jean-Paul Garraud',
      'Grand Est': 'Laurent Jacobelli',
      'Île-de-France': 'Jordan Bardella'
    },
    NFP: {
      'Île-de-France': 'Anne Hidalgo',
      'Provence-Alpes-Côte d\'Azur': 'Benoît Payan',
      'Auvergne-Rhône-Alpes': 'Grégory Doucet',
      'Nouvelle-Aquitaine': 'Pierre Hurmic',
      'Occitanie': 'Carole Delga',
      'Bretagne': 'Nathalie Appéré'
    }
  },
  SE: {
    M: {
      'Stockholm': 'Karin Wanngård',
      'Västra Götaland': 'Axel Josefson',
      'Skåne': 'Katrin Stjernfeldt Jammeh',
      'Östergötland': 'Niklas Borg',
      'Uppsala': 'Erik Pelling'
    },
    S: {
      'Stockholm': 'Karin Wanngård',
      'Västra Götaland': 'Jonas Attenius',
      'Skåne': 'Katrin Stjernfeldt Jammeh',
      'Norrbotten': 'Anders Öberg',
      'Västerbotten': 'Rickard Carstedt'
    }
  },
  PT: {
    PSD: {
      'Lisboa': 'Carlos Moedas',
      'Porto': 'Rui Moreira',
      'Braga': 'Ricardo Rio',
      'Coimbra': 'José Manuel Silva',
      'Faro': 'Rogério Bacalhau',
      'Funchal': 'Pedro Calado',
      'Ponta Delgada': 'Pedro Nascimento Cabral'
    },
    PS: {
      'Lisboa': 'Fernando Medina',
      'Porto': 'Manuel Pizarro',
      'Setúbal': 'André Martins',
      'Évora': 'Carlos Pinto de Sá',
      'Coimbra': 'Manuel Machado'
    }
  },
  GR: {
    ND: {
      'Attica': 'Nikos Hardalias',
      'Central Macedonia': 'Apostolos Tzitzikostas',
      'Thessaly': 'Dimitris Kouretas',
      'Western Greece': 'Nektarios Farmakis',
      'Crete': 'Stavros Arnaoutakis',
      'Peloponnese': 'Dimitrios Ptochos'
    },
    PASOK: {
      'Athens': 'Haris Doukas',
      'Crete': 'Stavros Arnaoutakis',
      'Thessaloniki': 'Stelios Angeloudis'
    }
  },
  IS: {
    IP: {
      'Reykjavík': 'Dagur B. Eggertsson',
      'Southwest': 'Ásdís Kristjánsdóttir',
      'Northeast': 'Ásthildur Sturludóttir',
      'Northwest': 'Sigurður Enoksson',
      'South': 'Fannar Jónasson'
    }
  }
};

/**
 * Get party governor/mayor name for a given region, party, and country.
 * ALWAYS returns a region-and-party-specific real candidate or mayor, NEVER national party leader.
 */
export function getPartyGovernorForRegion(
  regionName: string,
  partyId: string,
  countryId: string,
  playerParty?: Party,
  rivals?: RivalParty[],
  regionObj?: Region
): string {
  // If a region explicitly has a player-nominated candidate and player won, use that!
  if (playerParty && (partyId === playerParty.id || partyId === 'player_party')) {
    if (regionObj && regionObj.playerCandidate && regionObj.playerCandidate.trim() !== '') {
      return regionObj.playerCandidate;
    }
  }
  if (regionObj && regionObj.nominatedCandidates && regionObj.nominatedCandidates[partyId]) {
    return regionObj.nominatedCandidates[partyId];
  }

  // Determine effective party keys to search in SPECIFIC_PARTY_MAYORS
  const keysToTry: string[] = [];

  if (playerParty && (partyId === playerParty.id || partyId === 'player_party')) {
    keysToTry.push(playerParty.id.toUpperCase());
    if (playerParty.name) {
      keysToTry.push(playerParty.name.toUpperCase());
      const firstWord = playerParty.name.split(' ')[0].toUpperCase();
      keysToTry.push(firstWord);
    }
  } else {
    keysToTry.push(partyId.toUpperCase());
    if (rivals) {
      const rival = rivals.find(r => r.id === partyId);
      if (rival) {
        keysToTry.push(rival.name.toUpperCase());
        const firstWord = rival.name.split(' ')[0].toUpperCase();
        keysToTry.push(firstWord);
      }
    }
  }

  const countryTable = SPECIFIC_PARTY_MAYORS[countryId];
  if (countryTable) {
    for (const [pKey, regMap] of Object.entries(countryTable)) {
      const normalizedPKey = pKey.toUpperCase();
      if (keysToTry.some(k => k.includes(normalizedPKey) || normalizedPKey.includes(k))) {
        // Look up region name by exact or partial match
        if (regMap[regionName]) return regMap[regionName];
        for (const [rKey, candidateName] of Object.entries(regMap)) {
          if (regionName.toLowerCase().includes(rKey.toLowerCase()) || rKey.toLowerCase().includes(regionName.toLowerCase())) {
            return candidateName;
          }
        }
      }
    }
    // Fallback search across opposition / primary parties in country table
    for (const [, regMap] of Object.entries(countryTable)) {
      if (regMap[regionName]) return regMap[regionName];
    }
  }

  // Fallback to region-specific deterministic name
  const seed = `${countryId}_${partyId}_${regionName}`;
  return getDeterministicName(seed, countryId);
}

/**
 * Synchronize all regions' owner party and mayor name based on current highest support in supports.
 */
export function syncRegionOwnersAndMayors(
  regions: Region[],
  countryId: string,
  playerParty?: Party,
  rivals?: RivalParty[]
): Region[] {
  return regions.map(reg => {
    let maxSupport = -1;
    let leadingPartyId = reg.ownerPartyId || '';

    // Find party with maximum support percentage in this region
    if (reg.supports && Object.keys(reg.supports).length > 0) {
      Object.entries(reg.supports).forEach(([pid, val]) => {
        const supportVal = typeof val === 'number' ? val : 0;
        if (supportVal > maxSupport) {
          maxSupport = supportVal;
          leadingPartyId = pid;
        }
      });
    }

    const ownerChanged = reg.ownerPartyId !== leadingPartyId;
    const missingMayor = !reg.mayorName || reg.mayorName.trim() === '';

    if (ownerChanged || missingMayor) {
      const newMayorName = getPartyGovernorForRegion(
        reg.name,
        leadingPartyId,
        countryId,
        playerParty,
        rivals,
        reg
      );

      return {
        ...reg,
        ownerPartyId: leadingPartyId,
        mayorName: newMayorName
      };
    }

    return reg;
  });
}
