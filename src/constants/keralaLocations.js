// Official Kerala 14 Districts with Malayalam names and English aliases
export const OFFICIAL_DISTRICTS = [
  { en: 'Kasaragod', ml: 'കാസർഗോഡ്' },
  { en: 'Kannur', ml: 'കണ്ണൂർ' },
  { en: 'Wayanad', ml: 'വയനാട്' },
  { en: 'Kozhikode', ml: 'കോഴിക്കോട്', aliases: ['Calicut'] },
  { en: 'Malappuram', ml: 'മലപ്പുറം' },
  { en: 'Palakkad', ml: 'പാലക്കാട്', aliases: ['Palghat'] },
  { en: 'Thrissur', ml: 'തൃശ്ശൂർ', aliases: ['Trichur'] },
  { en: 'Ernakulam', ml: 'എറണാകുളം', aliases: ['Cochin'] },
  { en: 'Idukki', ml: 'ഇടുക്കി' },
  { en: 'Kottayam', ml: 'കോട്ടയം' },
  { en: 'Alappuzha', ml: 'ആലപ്പുഴ', aliases: ['Alleppey'] },
  { en: 'Pathanamthitta', ml: 'പത്തനംതിട്ട' },
  { en: 'Kollam', ml: 'കൊല്ലം', aliases: ['Quilon'] },
  { en: 'Thiruvananthapuram', ml: 'തിരുവനന്തപുരം', aliases: ['Trivandrum'] },
];

// Official Kerala 77 Taluks with Malayalam names and known spelling typos / aliases
export const OFFICIAL_TALUKS = [
  // Kasaragod
  { en: 'Kasaragod', ml: 'കാസർഗോഡ്', district: 'Kasaragod' },
  { en: 'Hosdurg', ml: 'ഹോസ്ദുർഗ്', district: 'Kasaragod' },
  { en: 'Manjeshwaram', ml: 'മഞ്ചേശ്വരം', aliases: ['Manjeshwar'], district: 'Kasaragod' },
  { en: 'Vellarikundu', ml: 'വെള്ളരിക്കുണ്ട്', district: 'Kasaragod' },

  // Kannur
  { en: 'Kannur', ml: 'കണ്ണൂർ', district: 'Kannur' },
  { en: 'Thalassery', ml: 'തലശ്ശേരി', aliases: ['Tellicherry', 'Thalasseri'], district: 'Kannur' },
  { en: 'Taliparamba', ml: 'തളിപ്പറമ്പ്', aliases: ['Thaliparamba'], district: 'Kannur' },
  { en: 'Iritty', ml: 'ഇരിട്ടി', mlAliases: ['ഇരുട്ടി'], district: 'Kannur' },
  { en: 'Payyanur', ml: 'പയ്യന്നൂർ', district: 'Kannur' },

  // Wayanad
  { en: 'Mananthavady', ml: 'മാനന്തവാടി', aliases: ['Mananthavadi'], district: 'Wayanad' },
  { en: 'Sultan Bathery', ml: 'സുൽത്താൻ ബത്തേരി', aliases: ['Sulthan Bathery', 'Sultanbathery'], district: 'Wayanad' },
  { en: 'Vythiri', ml: 'വൈത്തിരി', mlAliases: ['വെത്തിരി'], aliases: ['Vaithiri', 'Vythiry'], district: 'Wayanad' },

  // Kozhikode
  { en: 'Kozhikode', ml: 'കോഴിക്കോട്', aliases: ['Calicut'], district: 'Kozhikode' },
  { en: 'Koyilandy', ml: 'കൊയിലാണ്ടി', aliases: ['Quilandy', 'Koyilandi'], district: 'Kozhikode' },
  { en: 'Vatakara', ml: 'വടകര', aliases: ['Vadakara', 'Badagara', 'Padakara'], district: 'Kozhikode' },
  { en: 'Thamarassery', ml: 'താമരശ്ശേരി', aliases: ['Thamarasseri', 'Thamarassheri'], district: 'Kozhikode' },

  // Malappuram
  {
    en: 'Ernad',
    ml: 'ഏറനാട്',
    aliases: ['Eranad', 'Earanad', 'Eranadu', 'ERANAAD', 'Earanaad taluk', 'ERNAD(MANJERI)', 'Manjeri'],
    district: 'Malappuram',
  },
  {
    en: 'Tirur',
    ml: 'തിരൂർ',
    mlAliases: ['തിരൂര്'],
    aliases: ['Thirur', 'Thirur taluk', 'THIRIUR', 'TIURUR'],
    district: 'Malappuram',
  },
  {
    en: 'Tirurangadi',
    ml: 'തിരൂരങ്ങാടി',
    aliases: ['Thirurangadi', 'Tiroorangadi', 'Thiruranghadi'],
    district: 'Malappuram',
  },
  { en: 'Ponnani', ml: 'പൊന്നാനി', aliases: ['Ponnanni', 'Ponani'], district: 'Malappuram' },
  {
    en: 'Perinthalmanna',
    ml: 'പെരിന്തൽമണ്ണ',
    aliases: [
      'Perintalmanna',
      'Perindalmanna',
      'Perinthalamanna',
      'Perithalmanna',
      'Perinthalmana',
      'Perithalmana',
      'perunthalmanna',
      'Perinatalmanna',
      'Perithal manna',
      'PRRINTHAL MANNA',
    ],
    district: 'Malappuram',
  },
  { en: 'Nilambur', ml: 'നിലമ്പൂർ', aliases: ['Nilamboor'], district: 'Malappuram' },
  { en: 'Kondotty', ml: 'കൊണ്ടോട്ടി', aliases: ['Kondotti', 'kondoty'], district: 'Malappuram' },

  // Palakkad
  { en: 'Palakkad', ml: 'പാലക്കാട്', aliases: ['Palghat'], district: 'Palakkad' },
  { en: 'Alathur', ml: 'ആലത്തൂർ', aliases: ['Alathuer', 'Alattoor', 'Alatur', 'Alathoor', 'ALATHUR'], district: 'Palakkad' },
  { en: 'Chittur', ml: 'ചിറ്റൂർ', aliases: ['Chittoor'], district: 'Palakkad' },
  {
    en: 'Ottappalam',
    ml: 'ഒറ്റപ്പാലം',
    aliases: [
      'Ottapalam',
      'Ottappalm',
      'Otapalam',
      'Ottappaalam',
      'Ottppalam',
      'Ottpalam',
      'OTTPALM',
      'Shornur',
      'Shornoor',
      'Cherpulassery',
      'Cherppulassheri',
    ],
    district: 'Palakkad',
  },
  {
    en: 'Mannarkkad',
    ml: 'മണ്ണാർക്കാട്',
    aliases: ['Mannarkad', 'Mannarakkad', 'Mannarkkard', 'Mannarkade', 'Mannarkkaf'],
    district: 'Palakkad',
  },
  { en: 'Pattambi', ml: 'പട്ടാമ്പി', aliases: ['Patt', 'Patambi'], district: 'Palakkad' },
  {
    en: 'Attappady',
    ml: 'അട്ടപ്പാടി',
    aliases: ['Attapadi', 'Attapady', 'Attappadi', 'Attappadi taluk', 'Attapadi taluk'],
    district: 'Palakkad',
  },

  // Thrissur
  { en: 'Thrissur', ml: 'തൃശ്ശൂർ', aliases: ['Trichur'], district: 'Thrissur' },
  { en: 'Chavakkad', ml: 'ചാവക്കാട്', aliases: ['Chowghat', 'chavakad'], district: 'Thrissur' },
  { en: 'Kodungallur', ml: 'കൊടുങ്ങല്ലൂർ', aliases: ['Cranganore'], district: 'Thrissur' },
  { en: 'Mukundapuram', ml: 'മുകുന്ദപുരം', aliases: ['Irinjalakuda'], district: 'Thrissur' },
  { en: 'Chalakudy', ml: 'ചാലക്കുടി', aliases: ['Chalakudi'], district: 'Thrissur' },
  {
    en: 'Thalapilly',
    ml: 'തലപ്പിള്ളി',
    aliases: ['Talappilly', 'Thalappilly', 'Thaplapilli', 'Thalappilli', 'Wadakkanchery', 'chelakkara'],
    district: 'Thrissur',
  },
  { en: 'Kunnamkulam', ml: 'കുന്നംകുളം', district: 'Thrissur' },

  // Ernakulam
  { en: 'Aluva', ml: 'ആലുവ', aliases: ['Alwaye'], district: 'Ernakulam' },
  { en: 'Kanayannur', ml: 'കണയന്നൂർ', aliases: ['Ernakulam'], district: 'Ernakulam' },
  { en: 'Kochi', ml: 'കൊച്ചി', aliases: ['Cochin', 'Fort Kochi'], district: 'Ernakulam' },
  { en: 'Kothamangalam', ml: 'കോതമംഗലം', district: 'Ernakulam' },
  { en: 'Kunnathunad', ml: 'കുന്നത്തുനാട്', aliases: ['Perumbavoor', 'Kunnathunadu'], district: 'Ernakulam' },
  { en: 'Muvattupuzha', ml: 'മൂവാറ്റുപുഴ', district: 'Ernakulam' },
  { en: 'Paravur', ml: 'പറവൂർ', aliases: ['North Paravur', 'North Paravoor', 'Paravoor'], district: 'Ernakulam' },

  // Idukki
  { en: 'Devikulam', ml: 'ദേവികുളം', district: 'Idukki' },
  { en: 'Idukki', ml: 'ഇടുക്കി', district: 'Idukki' },
  { en: 'Peerumade', ml: 'പീരുമേട്', aliases: ['Peerumedu', 'Peermade'], district: 'Idukki' },
  { en: 'Thodupuzha', ml: 'തൊടുപുഴ', district: 'Idukki' },
  { en: 'Udumbanchola', ml: 'ഉടുമ്പൻചോല', district: 'Idukki' },

  // Kottayam
  { en: 'Changanassery', ml: 'ചങ്ങനാശ്ശേരി', aliases: ['Changanacherry'], district: 'Kottayam' },
  { en: 'Kanjirappally', ml: 'കാഞ്ഞിരപ്പള്ളി', aliases: ['Kanjirapally'], district: 'Kottayam' },
  { en: 'Kottayam', ml: 'കോട്ടയം', district: 'Kottayam' },
  { en: 'Meenachil', ml: 'മീനച്ചിൽ', aliases: ['Pala'], district: 'Kottayam' },
  { en: 'Vaikom', ml: 'വൈക്കം', district: 'Kottayam' },

  // Alappuzha
  { en: 'Ambalappuzha', ml: 'അമ്പലപ്പുഴ', aliases: ['Ambalapuzha', 'Alleppey'], district: 'Alappuzha' },
  { en: 'Chengannur', ml: 'ചെങ്ങന്നൂർ', district: 'Alappuzha' },
  { en: 'Cherthala', ml: 'ചേർത്തല', aliases: ['Shertallai'], district: 'Alappuzha' },
  {
    en: 'Karthikappally',
    ml: 'കാർത്തികപ്പള്ളി',
    aliases: ['Karthikapally', 'Kaarthikapalli', 'Haripad'],
    district: 'Alappuzha',
  },
  { en: 'Kuttanad', ml: 'കുട്ടനാട്', aliases: ['Kuttanadu', 'Mankombu'], district: 'Alappuzha' },
  { en: 'Mavelikkara', ml: 'മാവേലിക്കര', district: 'Alappuzha' },

  // Pathanamthitta
  { en: 'Adoor', ml: 'അടൂർ', district: 'Pathanamthitta' },
  { en: 'Konni', ml: 'കോന്നി', district: 'Pathanamthitta' },
  { en: 'Kozhencherry', ml: 'കോഴഞ്ചേരി', aliases: ['Pathanamthitta'], district: 'Pathanamthitta' },
  { en: 'Mallappally', ml: 'മല്ലപ്പള്ളി', aliases: ['Mallapally'], district: 'Pathanamthitta' },
  { en: 'Ranni', ml: 'റാന്നി', district: 'Pathanamthitta' },
  { en: 'Thiruvalla', ml: 'തിരുവല്ല', district: 'Pathanamthitta' },

  // Kollam
  { en: 'Kollam', ml: 'കൊല്ലം', aliases: ['Quilon'], district: 'Kollam' },
  { en: 'Karunagappally', ml: 'കരുനാഗപ്പള്ളി', aliases: ['Karunagapally'], district: 'Kollam' },
  { en: 'Kunnathur', ml: 'കുന്നത്തൂർ', aliases: ['Kunnathoor'], district: 'Kollam' },
  { en: 'Kottarakkara', ml: 'കൊട്ടാരക്കര', aliases: ['Kottarakara'], district: 'Kollam' },
  { en: 'Pathanapuram', ml: 'പത്തനാപുരം', district: 'Kollam' },
  { en: 'Punalur', ml: 'പുനലൂർ', district: 'Kollam' },

  // Thiruvananthapuram
  { en: 'Thiruvananthapuram', ml: 'തിരുവനന്തപുരം', aliases: ['Trivandrum'], district: 'Thiruvananthapuram' },
  { en: 'Chirayinkeezhu', ml: 'ചിറയിൻകീഴ്', aliases: ['Attingal', 'Chirayinkil', 'Chirayinkeezh'], district: 'Thiruvananthapuram' },
  { en: 'Nedumangad', ml: 'നെടുമങ്ങാട്', district: 'Thiruvananthapuram' },
  { en: 'Neyyattinkara', ml: 'നെയ്യാറ്റിൻകര', district: 'Thiruvananthapuram' },
  { en: 'Varkala', ml: 'വർക്കല', aliases: ['Varakala'], district: 'Thiruvananthapuram' },
  { en: 'Kattakada', ml: 'കാട്ടാക്കട', district: 'Thiruvananthapuram' },

  // Border / Other recognized taluks
  {
    en: 'Panthalur',
    ml: 'പന്തലൂർ',
    aliases: ['Pandallur', 'Pandalur', 'Panthaloor', 'Pandaloor'],
    district: 'Nilgiris',
  },
  {
    en: 'Gudalur',
    ml: 'ഗൂഡല്ലൂർ',
    aliases: ['Gudallur'],
    district: 'Nilgiris',
  },
  {
    en: 'Virajpet',
    ml: 'വിരാജ്പേട്ട',
    aliases: ['viraj Pet', 'Viraj Pet', 'Virajpett'],
    district: 'Kodagu',
  },
  {
    en: 'Ferrargunj',
    ml: 'ഫെറാർഗഞ്ച്',
    aliases: ['Ferrargunj'],
    district: 'South Andaman',
  },
];

// Official Kerala 140 Assembly Constituencies (Mandalams) with Malayalam names and common spelling typos / aliases
export const OFFICIAL_MANDALAMS = [
  // Kasaragod
  { en: 'Manjeshwar', ml: 'മഞ്ചേശ്വരം', aliases: ['Manjeshwaram', 'Manjeswar'] },
  { en: 'Kasaragod', ml: 'കാസർഗോഡ്', aliases: ['Kasargod', 'Kasargode'] },
  { en: 'Udma', ml: 'ഉദുമ', aliases: ['Uduma'] },
  { en: 'Kanhangad', ml: 'കാഞ്ഞങ്ങാട്' },
  { en: 'Trikaripur', ml: 'തൃക്കരിപ്പൂർ', aliases: ['Thrikaripur', 'Thrikkarippur'] },

  // Kannur
  { en: 'Payyanur', ml: 'പയ്യന്നൂർ' },
  { en: 'Kalliasseri', ml: 'കല്യാശ്ശേരി', aliases: ['Kallyasheri', 'Kalyassery'] },
  { en: 'Taliparamba', ml: 'തളിപ്പറമ്പ്', aliases: ['Thaliparamba', 'THALIPPARAMBA'] },
  { en: 'Irikkur', ml: 'ഇരിക്കൂർ', aliases: ['Irikkoor', 'IRIKKOOR'] },
  { en: 'Azhikode', ml: 'അഴീക്കോട്' },
  { en: 'Kannur', ml: 'കണ്ണൂർ' },
  { en: 'Dharmadam', ml: 'ധർമ്മടം' },
  { en: 'Thalassery', ml: 'തലശ്ശേരി', aliases: ['Tellicherry'] },
  { en: 'Mattannur', ml: 'മട്ടന്നൂർ', aliases: ['മട്ടന്നൂർ'] },
  { en: 'Kuthuparamba', ml: 'കൂത്തുപറമ്പ്' },
  { en: 'Peravoor', ml: 'പേരാവൂർ' },

  // Wayanad
  { en: 'Mananthavady', ml: 'മാനന്തവാടി', aliases: ['MANANTHAVADY'] },
  { en: 'Sulthan Bathery', ml: 'സുൽത്താൻ ബത്തേരി', aliases: ['Sultan Bathery'] },
  { en: 'Kalpetta', ml: 'കൽപ്പറ്റ', aliases: ['Kalpatta', 'Kalppatta', 'കല്പറ്റ'] },

  // Kozhikode
  { en: 'Vadakara', ml: 'വടകര', aliases: ['Vatakara', 'വടകര'] },
  { en: 'Kuttiadi', ml: 'കുറ്റ്യാടി' },
  { en: 'Nadapuram', ml: 'നാദാപുരം' },
  { en: 'Koyilandy', ml: 'കൊയിലാണ്ടി', aliases: ['Quilandy'] },
  { en: 'Perambra', ml: 'പേരാമ്പ്ര' },
  { en: 'Balussery', ml: 'ബാലുശ്ശേരി' },
  { en: 'Elathur', ml: 'എലത്തൂർ' },
  { en: 'Kozhikode North', ml: 'കോഴിക്കോട് നോർത്ത്' },
  { en: 'Kozhikode South', ml: 'കോഴിക്കോട് സൗത്ത്', aliases: ['Kozhikode south'] },
  { en: 'Beypore', ml: 'ബേപ്പൂർ', aliases: ['beypore'] },
  { en: 'Kunnamangalam', ml: 'കുന്നമംഗലം', aliases: ['KUNNAMANGALAM'] },
  { en: 'Koduvally', ml: 'കൊടുവള്ളി', aliases: ['KODUVALLY'] },
  { en: 'Thiruvambady', ml: 'തിരുവമ്പാടി', aliases: ['Thiruvampadi'] },

  // Malappuram
  {
    en: 'Kondotty',
    ml: 'കൊണ്ടോട്ടി',
    aliases: ['Kondotti', 'kondoty', 'kondottiy', 'Kontotti', 'കൊണ്ടോട്ടി'],
  },
  {
    en: 'Eranad',
    ml: 'ഏറനാട്',
    aliases: ['Ernad', 'Earanad', 'Eranad mandalam'],
  },
  { en: 'Nilambur', ml: 'നിലമ്പൂർ', aliases: ['Nilamboor', 'Nilabur'] },
  {
    en: 'Wandoor',
    ml: 'വണ്ടൂർ',
    aliases: ['Vandoor', 'VANDOOR', 'WNDOOR', 'VANDUR', 'വണ്ടൂർ'],
  },
  {
    en: 'Manjeri',
    ml: 'മഞ്ചേരി',
    aliases: ['MANJERI', 'MANCHERI', 'Manjaeri', 'Manjari', 'MANJERY', 'Menjeri', 'മഞ്ചേരി'],
  },
  {
    en: 'Perinthalmanna',
    ml: 'പെരിന്തൽമണ്ണ',
    aliases: [
      'PERINTHALMANNA',
      'PERITHALMANNA',
      'Perintalmanna',
      'perinthalmanna',
      'PERINTHHALMANNA',
      'Perithalmanna',
      'Perinathalamanna',
      'Pernthalmanna',
      'PERINTHAL MANNA',
      'perintalmanna',
      'Perinthalamanna',
      'PERINTALMANNA',
      'Perinthalmannna',
      'Perinthalmana',
      'Perinthalmnna',
      'Perithalmana',
      'Perinthamanna',
      'Perinthlmanna',
      'Perindalmanna',
      'പെരിന്തൽമണ്ണ',
    ],
  },
  {
    en: 'Mankada',
    ml: 'മങ്കട',
    aliases: ['MANKADA', 'Mangada', 'mankada', 'മങ്കട', 'MANKDA', 'Makada', 'Manakada', 'MANGADA', 'Mankeda', 'Mankda'],
  },
  {
    en: 'Malappuram',
    ml: 'മലപ്പുറം',
    aliases: ['MALAPPURAM', 'Malapuram', 'മലപ്പുറം'],
  },
  { en: 'Vengara', ml: 'വേങ്ങര', aliases: ['VENGARA', 'Veengara'] },
  {
    en: 'Vallikkunnu',
    ml: 'വള്ളിക്കുന്ന്',
    aliases: ['VALLIKKUNNU', 'Vallikunn', 'VALLIKKUNN', 'Vallikunnu', 'വള്ളിക്കുന്ന്'],
  },
  {
    en: 'Tirurangadi',
    ml: 'തിരൂരങ്ങാടി',
    aliases: ['Thirurangadi', 'THIRURANGADI', 'TIROORANGADI', 'Theruragadi', 'തിരൂരങ്ങാടി'],
  },
  {
    en: 'Tanur',
    ml: 'താനൂർ',
    aliases: ['TANUR', 'Thanur', 'താനൂർ', 'tanur', 'THANUR', 'Thanur mandalam'],
  },
  { en: 'Tirur', ml: 'തിരൂർ', aliases: ['TIRUR', 'Thirur', 'TIURUR'] },
  {
    en: 'Kottakkal',
    ml: 'കോട്ടക്കൽ',
    aliases: ['KOTTAKKAL', 'Kotakkal', 'കോട്ടക്കൽ', 'kottakkal', 'KOTAKKAL'],
  },
  {
    en: 'Thavanur',
    ml: 'തവനൂർ',
    aliases: ['Thavanoor', 'THAVANUR', 'Tavanur', 'TAVANOOR', 'THAVANOOR', 'thavanur', 'Tavanoor', 'Thavnur'],
  },
  { en: 'Ponnani', ml: 'പൊന്നാനി', aliases: ['PONNANI', 'PNNANI', 'പൊന്നാനി'] },

  // Palakkad
  {
    en: 'Thrithala',
    ml: 'തൃത്താല',
    aliases: ['THRITHALA', 'Thrthala', 'Trtala', 'Trithala', 'TRITALA', 'TRITHALA', 'THIRTHALA', 'തൃത്താല', 'thirthala', 'Thritala', 'Trutala'],
  },
  {
    en: 'Pattambi',
    ml: 'പട്ടാമ്പി',
    aliases: ['PATTAMBI', 'pattambi', 'PATTAMB', 'Pattamb', 'പട്ടാമ്പി'],
  },
  {
    en: 'Shornur',
    ml: 'ഷൊർണൂർ',
    aliases: [
      'Shoranur',
      'Shornoor',
      'SHORNUR',
      'SHORANUR',
      'SHORNOOR',
      'SHORANOR',
      'Shournoor',
      'Shournur',
      'SHORNNOOR',
      'Shornnur',
      'Sornoor',
      'shornoor',
      'shornur',
      'Shornooru',
      'SHARANUR',
      'Shernur',
      'Shornor',
      'Sharnoor',
      'SHORANOOR',
      'Shornour',
      'ഷൊർണൂർ',
      'ഷെർണ്ണൂർ',
      'ഷൊർണുർ',
      'ഷെർണൂർ',
    ],
  },
  {
    en: 'Ottapalam',
    ml: 'ഒറ്റപ്പാലം',
    aliases: [
      'Ottappalam',
      'OTTAPPALAM',
      'ottappalam',
      'OTTAPALAM',
      'Ottapaalm',
      'Ottappam',
      'OTTPAPPALAM',
      'Ottappalm',
      'OTTAPPALA',
      'ഒറ്റപ്പാലം',
    ],
  },
  { en: 'Kongad', ml: 'കോങ്ങാട്', aliases: ['KONGAD', 'Kognad', 'Kongade', 'Kongadu'] },
  {
    en: 'Mannarkkad',
    ml: 'മണ്ണാർക്കാട്',
    aliases: [
      'MANNARKKAD',
      'MANNARKAD',
      'Mannarkad',
      'മണ്ണാർക്കാട്',
      'Mannatkad',
      'MANMARKKAD',
      'MANNARAKKAD',
      'mannarkkad',
      'MNNARKAD',
      'Mannarkkard',
    ],
  },
  { en: 'Malampuzha', ml: 'മലമ്പുഴ' },
  { en: 'Palakkad', ml: 'പാലക്കാട്', aliases: ['Palghat', 'palakkad'] },
  { en: 'Tarur', ml: 'തരൂർ', aliases: ['THARUR', 'Tharoor', 'Taroor', 'തരുർ'] },
  { en: 'Chittur', ml: 'ചിറ്റൂർ', aliases: ['Chittoor'] },
  { en: 'Nenmara', ml: 'നെന്മാറ', aliases: ['Nemmara', 'NENMARA', 'Nenmmara'] },
  {
    en: 'Alathur',
    ml: 'ആലത്തൂർ',
    aliases: ['ALATHUR', 'Alattoor', 'Alatur', 'Alathoor', 'ആലത്തൂർ'],
  },

  // Thrissur
  {
    en: 'Chelakkara',
    ml: 'ചേലക്കര',
    aliases: ['CHELAKKARA', 'ചേലക്കര', 'chelakkara', 'Chelakkkara', 'Chelakara', 'CHELKKARA'],
  },
  {
    en: 'Kunnamkulam',
    ml: 'കുന്നംകുളം',
    aliases: ['KUNNAMKULAM', 'KUNNAMKKULAM'],
  },
  {
    en: 'Guruvayoor',
    ml: 'ഗുരുവായൂർ',
    aliases: ['Guruvayur', 'guruvaayoor', 'kuruvayoor', 'GURUVAYOOR'],
  },
  { en: 'Manalur', ml: 'മണലൂർ', aliases: ['Manaloor', 'MANALOOR'] },
  {
    en: 'Wadakkanchery',
    ml: 'വടക്കാഞ്ചേരി',
    aliases: ['vadackanchery', 'WADAKANCHERI'],
  },
  { en: 'Ollur', ml: 'ഒല്ലൂർ' },
  { en: 'Thrissur', ml: 'തൃശ്ശൂർ', aliases: ['Trichur'] },
  { en: 'Nattika', ml: 'നാട്ടിക', aliases: ['NATTIKA', 'Natika'] },
  { en: 'Kaipamangalam', ml: 'കൈപ്പമംഗലം', aliases: ['KAIPAMANGALAM', 'kaipamangalam'] },
  {
    en: 'Irinjalakuda',
    ml: 'ഇരിഞ്ഞാലക്കുട',
    aliases: ['Iringalakkuda', 'IRINJALAKKUDA'],
  },
  { en: 'Puthukkad', ml: 'പുതുക്കാട്', aliases: ['Pudukkad'] },
  { en: 'Chalakudy', ml: 'ചാലക്കുടി', aliases: ['CHALAKUDY', 'Chalakkudy'] },
  {
    en: 'Kodungallur',
    ml: 'കൊടുങ്ങല്ലൂർ',
    aliases: ['KODUNGALLUR', 'Kodungallor', 'Kodungalloor'],
  },

  // Ernakulam
  { en: 'Perumbavoor', ml: 'പെരുമ്പാവൂർ' },
  { en: 'Angamaly', ml: 'അങ്കമാലി' },
  { en: 'Aluva', ml: 'ആലുവ', aliases: ['Alwaye'] },
  { en: 'Kalamassery', ml: 'കളമശ്ശേരി' },
  { en: 'Paravur', ml: 'പറവൂർ', aliases: ['North Paravur'] },
  { en: 'Vypin', ml: 'വൈപ്പിൻ' },
  { en: 'Kochi', ml: 'കൊച്ചി', aliases: ['Cochin'] },
  { en: 'Thrippunithura', ml: 'തൃപ്പൂണിത്തുറ' },
  { en: 'Ernakulam', ml: 'എറണാകുളം' },
  { en: 'Thrikkakara', ml: 'തൃക്കാക്കര', aliases: ['THRIKKAKARA'] },
  { en: 'Kunnathunad', ml: 'കുന്നത്തുനാട്', aliases: ['KUNNATHUNAD'] },
  { en: 'Piravom', ml: 'പിറവം' },
  { en: 'Muvattupuzha', ml: 'മൂവാറ്റുപുഴ' },
  { en: 'Kothamangalam', ml: 'കോതമംഗലം', aliases: ['KOTHAMANGALAM'] },

  // Idukki
  { en: 'Devikulam', ml: 'ദേവികുളം' },
  { en: 'Udumbanchola', ml: 'ഉടുമ്പൻചോല', aliases: ['Udubanchola'] },
  { en: 'Thodupuzha', ml: 'തൊടുപുഴ' },
  { en: 'Idukki', ml: 'ഇടുക്കി' },
  { en: 'Peerumade', ml: 'പീരുമേട്' },

  // Kottayam
  { en: 'Pala', ml: 'പാലാ' },
  { en: 'Kaduthuruthy', ml: 'കടുത്തുരുത്തി' },
  { en: 'Vaikom', ml: 'വൈക്കം' },
  { en: 'Ettumanoor', ml: 'ഏറ്റുമാനൂർ' },
  { en: 'Kottayam', ml: 'കോട്ടയം' },
  { en: 'Puthuppally', ml: 'പുതുപ്പള്ളി' },
  { en: 'Changanassery', ml: 'ചങ്ങനാശ്ശേരി' },
  { en: 'Kanjirappally', ml: 'കാഞ്ഞിരപ്പള്ളി' },
  { en: 'Poonjar', ml: 'പൂഞ്ഞാർ' },

  // Alappuzha
  { en: 'Aroor', ml: 'അരൂർ', aliases: ['AROOR'] },
  { en: 'Cherthala', ml: 'ചേർത്തല' },
  { en: 'Alappuzha', ml: 'ആലപ്പുഴ', aliases: ['Alleppey'] },
  {
    en: 'Ambalappuzha',
    ml: 'അമ്പലപ്പുഴ',
    aliases: ['AMBALAPPUZHA', 'Ambalapuzha'],
  },
  { en: 'Kuttanad', ml: 'കുട്ടനാട്' },
  { en: 'Haripad', ml: 'ഹരിപ്പാട്', aliases: ['HARIPPAD'] },
  { en: 'Kayamkulam', ml: 'കായംകുളം' },
  { en: 'Mavelikkara', ml: 'മാവേലിക്കര' },
  { en: 'Chengannur', ml: 'ചെങ്ങന്നൂർ', aliases: ['Chenganoor'] },

  // Pathanamthitta
  { en: 'Thiruvalla', ml: 'തിരുവല്ല' },
  { en: 'Ranni', ml: 'റാന്നി' },
  { en: 'Aranmula', ml: 'ആറന്മുള' },
  { en: 'Konni', ml: 'കോന്നി' },
  { en: 'Adoor', ml: 'അടൂർ' },

  // Kollam
  { en: 'Karunagappally', ml: 'കരുനാഗപ്പള്ളി' },
  { en: 'Chavara', ml: 'ചവറ' },
  { en: 'Kunnathur', ml: 'കുന്നത്തൂർ' },
  { en: 'Kottarakkara', ml: 'കൊട്ടാരക്കര' },
  { en: 'Pathanapuram', ml: 'പത്തനാപുരം' },
  { en: 'Punalur', ml: 'പുനലൂർ' },
  { en: 'Chadayamangalam', ml: 'ചടയമംഗലം' },
  { en: 'Kundara', ml: 'കുണ്ടറ', aliases: ['കുണ്ടറ'] },
  { en: 'Kollam', ml: 'കൊല്ലം' },
  { en: 'Eravipuram', ml: 'ഇരവിപുരം' },
  { en: 'Chathannoor', ml: 'ചാത്തന്നൂർ', aliases: ['Chathannor'] },

  // Thiruvananthapuram
  { en: 'Varkala', ml: 'വർക്കല', aliases: ['VARKALA'] },
  { en: 'Attingal', ml: 'ആറ്റിങ്ങൽ' },
  { en: 'Chirayinkeezhu', ml: 'ചിറയിൻകീഴ്' },
  { en: 'Nedumangad', ml: 'നെടുമങ്ങാട്' },
  { en: 'Vamanapuram', ml: 'വാമനപുരം' },
  { en: 'Kazhakoottam', ml: 'കഴക്കൂട്ടം' },
  { en: 'Vattiyoorkavu', ml: 'വട്ടിയൂർക്കാവ്' },
  { en: 'Thiruvananthapuram', ml: 'തിരുവനന്തപുരം', aliases: ['Trivandrum'] },
  { en: 'Nemom', ml: 'നേമം' },
  { en: 'Aruvikkara', ml: 'അരുവിക്കര' },
  { en: 'Parassala', ml: 'പാറശ്ശാല' },
  { en: 'Kattakada', ml: 'കാട്ടാക്കട' },
  { en: 'Kovalam', ml: 'കോവളം' },
  { en: 'Neyyattinkara', ml: 'നെയ്യാറ്റിൻകര' },

  // Border / Other States / UTs / Historical
  { en: 'Gudalur', ml: 'ഗൂഡല്ലൂർ', aliases: ['Gudallur'] },
  {
    en: 'Wimberlygunj',
    ml: 'വിംബർലിഗഞ്ച്',
    aliases: ['Wimberliy Gunj', 'Wimberliy gunj', 'Wimberly Gunj', 'Wimberleygunj', 'Wimberly gunj'],
  },
  { en: 'Ferrargunj', ml: 'ഫെറാർഗഞ്ച്', aliases: ['Ferrargunj'] },
  {
    en: 'Sreekrishnapuram',
    ml: 'ശ്രീകൃഷ്ണപുരം',
    aliases: ['SREEKRISHNAPURAM', 'Shreekrishnapuram', 'Shrekrshnapuram'],
  },
  {
    en: 'Cherpulassery',
    ml: 'ചെർപ്പുളശ്ശേരി',
    aliases: ['Cherpulasheri', 'CHERPPULASSERY', 'Cherpulasseri', 'Cherppulassery'],
  },
  { en: 'Kuttippuram', ml: 'കുറ്റിപ്പുറം', aliases: ['Kuttippuram', 'Kuttipuram'] },
  { en: 'Kuzhalmannam', ml: 'കുഴൽമന്ദം', aliases: ['Kuzhalmannam', 'Kuzhalmandam'] },
  { en: 'Virajpet', ml: 'വിരാജ്പേട്ട', aliases: ['viraj Pet', 'Viraj Pet', 'Virajpett'] },
  { en: 'Sakleshpur', ml: 'സക്ലേഷ്പുര', aliases: ['Sakleshpur'] },
  { en: 'Coimbatore', ml: 'കോയമ്പത്തൂർ', aliases: ['Coimbatore South', 'Coimbatore North'] },
  { en: 'Androth', ml: 'ആന്ത്രോത്ത്', aliases: ['ANDROTH', 'Andrott'] },
];

function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;
  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[bn][an];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  return (maxLen - levenshtein(a.toLowerCase(), b.toLowerCase())) / maxLen;
}

/**
 * Maps any input string (English, Malayalam, alias, or close typo) to its canonical bilingual object
 */
export const findCanonicalLocation = (type, val) => {
  if (!val || typeof val !== 'string') return null;
  const cleanVal = val.trim();
  const lowerVal = cleanVal.toLowerCase();
  
  let dataset = OFFICIAL_TALUKS;
  if (type === 'district') dataset = OFFICIAL_DISTRICTS;
  else if (type === 'mandalam') dataset = OFFICIAL_MANDALAMS;

  // 1. Exact or alias match
  const exact = dataset.find((item) => {
    if (item.en.toLowerCase() === lowerVal) return true;
    if (item.ml === cleanVal) return true;
    if (item.mlAliases && item.mlAliases.includes(cleanVal)) return true;
    if (item.aliases && item.aliases.some((a) => a.toLowerCase() === lowerVal)) return true;
    return false;
  });
  if (exact) return exact;

  // 2. Fuzzy match fallback (Levenshtein similarity >= 0.78)
  let best = null;
  let highestScore = 0;
  for (const item of dataset) {
    const sim = similarity(cleanVal, item.en);
    if (sim > highestScore) {
      highestScore = sim;
      best = item;
    }
    if (item.aliases) {
      for (const al of item.aliases) {
        const alSim = similarity(cleanVal, al);
        if (alSim > highestScore) {
          highestScore = alSim;
          best = item;
        }
      }
    }
  }

  if (highestScore >= 0.78) {
    return best;
  }

  return null;
};
