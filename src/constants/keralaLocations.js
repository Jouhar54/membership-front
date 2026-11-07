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
  { en: 'Vythiri', ml: 'വൈത്തിരി', mlAliases: ['വെത്തിരി'], aliases: ['Vaithiri'], district: 'Wayanad' },

  // Kozhikode
  { en: 'Kozhikode', ml: 'കോഴിക്കോട്', aliases: ['Calicut'], district: 'Kozhikode' },
  { en: 'Koyilandy', ml: 'കൊയിലാണ്ടി', aliases: ['Quilandy', 'Koyilandi'], district: 'Kozhikode' },
  { en: 'Vatakara', ml: 'വടകര', aliases: ['Vadakara', 'Badagara', 'Padakara'], district: 'Kozhikode' },
  { en: 'Thamarassery', ml: 'താമരശ്ശേരി', aliases: ['Thamarasseri', 'Thamarassheri'], district: 'Kozhikode' },

  // Malappuram
  {
    en: 'Ernad',
    ml: 'ഏറനാട്',
    aliases: ['Eranad', 'Earanad', 'Eranadu', 'Earanaad taluk', 'ERNAD(MANJERI)', 'Manjeri'],
    district: 'Malappuram',
  },
  {
    en: 'Tirur',
    ml: 'തിരൂർ',
    mlAliases: ['തിരൂര്'],
    aliases: ['Thirur', 'Thirur taluk', 'THIRIUR'],
    district: 'Malappuram',
  },
  {
    en: 'Tirurangadi',
    ml: 'തിരൂരങ്ങാടി',
    aliases: ['Thirurangadi', 'Tiroorangadi'],
    district: 'Malappuram',
  },
  { en: 'Ponnani', ml: 'പൊന്നാനി', aliases: ['Ponnanni'], district: 'Malappuram' },
  {
    en: 'Perinthalmanna',
    ml: 'പെരിന്തൽമണ്ണ',
    aliases: ['Perintalmanna', 'Perindalmanna', 'Perinthalamanna'],
    district: 'Malappuram',
  },
  { en: 'Nilambur', ml: 'നിലമ്പൂർ', district: 'Malappuram' },
  { en: 'Kondotty', ml: 'കൊണ്ടോട്ടി', aliases: ['Kondotti'], district: 'Malappuram' },

  // Palakkad
  { en: 'Palakkad', ml: 'പാലക്കാട്', aliases: ['Palghat'], district: 'Palakkad' },
  { en: 'Alathur', ml: 'ആലത്തൂർ', aliases: ['Alathuer'], district: 'Palakkad' },
  { en: 'Chittur', ml: 'ചിറ്റൂർ', aliases: ['Chittoor'], district: 'Palakkad' },
  {
    en: 'Ottappalam',
    ml: 'ഒറ്റപ്പാലം',
    aliases: ['Ottapalam', 'Ottappalm', 'Otapalam', 'Shornur', 'Shornoor', 'Cherpulassery', 'Cherppulassheri'],
    district: 'Palakkad',
  },
  {
    en: 'Mannarkkad',
    ml: 'മണ്ണാർക്കാട്',
    aliases: ['Mannarkad', 'Mannarakkad', 'Mannarkkard'],
    district: 'Palakkad',
  },
  { en: 'Pattambi', ml: 'പട്ടാമ്പി', aliases: ['Patt'], district: 'Palakkad' },
  { en: 'Attappady', ml: 'അട്ടപ്പാടി', aliases: ['Attapadi'], district: 'Palakkad' },

  // Thrissur
  { en: 'Thrissur', ml: 'തൃശ്ശൂർ', aliases: ['Trichur'], district: 'Thrissur' },
  { en: 'Chavakkad', ml: 'ചാവക്കാട്', aliases: ['Chowghat'], district: 'Thrissur' },
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
  { en: 'Chirayinkeezhu', ml: 'ചിറയിൻകീഴ്', aliases: ['Attingal', 'Chirayinkil'], district: 'Thiruvananthapuram' },
  { en: 'Nedumangad', ml: 'നെടുമങ്ങാട്', district: 'Thiruvananthapuram' },
  { en: 'Neyyattinkara', ml: 'നെയ്യാറ്റിൻകര', district: 'Thiruvananthapuram' },
  { en: 'Varkala', ml: 'വർക്കല', district: 'Thiruvananthapuram' },
  { en: 'Kattakada', ml: 'കാട്ടാക്കട', district: 'Thiruvananthapuram' },
];

/**
 * Maps any input string (English, Malayalam, or known alias) to its canonical bilingual object
 */
export const findCanonicalLocation = (type, val) => {
  if (!val || typeof val !== 'string') return null;
  const cleanVal = val.trim();
  const lowerVal = cleanVal.toLowerCase();
  const dataset = type === 'district' ? OFFICIAL_DISTRICTS : OFFICIAL_TALUKS;

  return dataset.find((item) => {
    if (item.en.toLowerCase() === lowerVal) return true;
    if (item.ml === cleanVal) return true;
    if (item.mlAliases && item.mlAliases.includes(cleanVal)) return true;
    if (item.aliases && item.aliases.some((a) => a.toLowerCase() === lowerVal)) return true;
    return false;
  }) || null;
};

