function musicsite(site, theme) {
  // device test
  var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));
  var userAgent = navigator.userAgent.toLowerCase();

  // one-click link
  var melon = "melonapp://play/?ctype=1&menuid=0&cid=";
  var melon_ipad = "melonipad://play/?ctype=1&menuid=0&cid=";
  var melon_win = "melonapp://play?cType=1&cList=";
  var melon_mac_1 = "melonplayer://play?ref=&cid=";
  var melon_mac_2 = "&cflag=1";
  var genie_iphone = "ktolleh00167://landing/?landing_type=31&landing_target=";
  var genie_android = "cromegenie://scan/?landing_type=31&landing_target=";
  var genie_web = "https://www.genie.co.kr/player/shareProcessV2?xgnm=";
  var bugs = "bugs3://app/tracks/lists?title=전체듣기&miniplay=Y&track_ids=";
  var bugs_mac_1 = "bugs3://app/tracks/";
  var bugs_mac_2 = "?autoplay=Y";
  var vibe = "vibe://listen?version=3&trackIds=";
  var music_site_url;

  var guide_site = new Array();
  var msg = new Array();

  // song-id
  var melon_songid = new Array();
  var genie_songid = new Array();
  var bugs_songid = new Array();
  var vibe_songid = new Array();
  var flo_image = new Array();

  // 0 - pick
  melon_songid[0] = "31927275,31295149,7844372,31927279,30772000,33210835,30771999,32586847,8120285,30399494,32892358,30658626,32115582,32115576,32586850,31149437,32586853,8120284,32115585,30617942,30285386,31149441,30189030,30457472,30232719,7844374,31149438,30658627,32586848,8120286,31481700";
  genie_songid[0] = "89220627;88233287;84964151;89220631;87591823;91978161;87591822;90194895;86112661;87121534;90756155;87463141;89472166;89472160;90194898;88072514;90194901;86112660;89472169;87415867;86990353;88072518;86866729;87185619;86931930;84964153;88072515;87463142;90194896;86112662;88455413";
  bugs_songid[0] = "31650949|31225862|4551004|31650953|30872543|32124930|30872542|31908732|30203513|30646155|32006767|30800908|31728999|31728993|31908735|31120687|31908738|30203512|31729002|30772387|30573081|31120691|30511021|30677528|30540153|4551006|31120688|30800909|31908733|30203514|31360122";
  vibe_songid[0] = "27852478,21712039,5701352,27852482,20121084,44037981,20121086,40319205,6049323,17736000,41909365,19183554,30184806,30165478,40319207,21408915,40319210,6049322,30184811,18939330,16473415,21408917,16035923,17836615,16081363,5701361,21408920,19183552,40319204,6049324,23177552";
  flo_image[0] = "/playlist/pick.gif"

  // 1 - Arcane Salon
  melon_songid[1] = "32892356,31927275,30507915,31927276,7844375,31927274,30399494,31295149,30658626,30285386,31481699,30232719,32892358,31481700,33210835,32892360,30399493,8120285,7844372";
  genie_songid[1] = "90756153;89220627;87264764;89220628;84964154;89220626;87121534;88233287;87463141;86990353;88455412;86931930;90756155;88455413;91978161;90756157;87121533;86112661;84964151";
  bugs_songid[1] = "32006765|31650949|30708337|31650950|4551007|31650948|30646155|31225862|30800908|30573081|31360121|30540153|32006767|31360122|32124930|32006769|30646154|30203513|4551004";
  vibe_songid[1] = "41909363,27852478,18419728,27852479,5701347,27852477,17736000,21712039,19183554,16473415,23177550,16081363,41909365,23177552,44037981,41909366,17735999,6049323,5701352";
  flo_image[1] = "/playlist/arcane-salon.gif"

  // 2 - present-2019
  melon_songid[2] = "32115582,32115584,30232719,31149441,30285386,30457472,32115585,30189030,8120284,30772000,31481700,30566475,7844375,30508688,31481703,32115575,32115576,31927275,32115577,30399493,7844372,8120285";
  genie_songid[2] = "89472166;89472168;86931930;88072518;86990353;87185619;89472169;86866729;86112660;87591823;88455413;87359517;84964154;87264765;88455416;89472159;89472160;89220627;89472161;87121533;84964151;86112661";
  bugs_songid[2] = "31728999|31729001|30540153|31120691|30573081|30677528|31729002|30511021|30203512|30872543|31360122|30742601|4551007|30708338|31360125|31728992|31728993|31650949|31728994|30646154|4551004|30203513";
  vibe_songid[2] = "30184806,30184810,16081363,21408917,16473415,17836615,30184811,16035923,6049322,20121084,23177552,18676777,5701347,18419729,23177561,30184802,30165478,27852478,30184807,17735999,5701352,6049323";
  flo_image[2] = "/playlist/the-present-2019.gif"

  // 3 - gravity
  melon_songid[3] = "31927279,8120285,8120286,31149438,31927275,31481703,7844373,31149439,31927276,31927274,31927277,7844376,31481700,8120283,7844377,30658627,30189029,30457471,31481701,31149436,31149437,31927275,31927278,7844374,30399493,7844372,8120285";
  genie_songid[3] = "89220631;86112661;86112662;88072515;89220627;88455416;84964152;88072516;89220628;89220626;89220629;84964155;88455413;86089285;84964156;87463142;86866728;87185618;88455414;88072513;88072514;89220627;89220630;84964153;87121533;84964151;86112661";
  bugs_songid[3] = "31650953|30203513|30203514|31120688|31650949|31360125|4551005|31120689|31650950|31650948|31650951|4551008|31360122|30203511|4551009|30800909|30511020|30677527|31360123|31120686|31120687|31650949|31650952|4551006|30646154|4551004|30203513";
  vibe_songid[3] = "27852482,6049323,6049324,21408920,27852478,23177561,5701356,21408916,27852479,27852477,27852481,5701349,23177552,6049321,5701354,19183552,16035922,17836612,23177555,21408918,21408915,27852478,27852480,5701361,17735999,5701352,6049323";
  flo_image[3] = "/playlist/gravity.gif"

  // 4 - love
  melon_songid[4] = "31927275,30771999,30711863,30772000,31295149,30507915,30399494,33210835,31927276,30345503,30233080,30345502";
  genie_songid[4] = "89220627;87591822;87527109;87591823;88233287;87264764;87121534;91978161;89220628;87064419;86931931;87064418";
  bugs_songid[4] = "31650949|30872542|30833862|30872543|31225862|30708337|30646155|32124930|31650950|30612024|30540154|30612023";
  vibe_songid[4] = "27852478,20121086,19738184,20121084,21712039,18419728,17736000,44037981,27852479,17409156,16081364,17409146";
  flo_image[4] = "/playlist/love.gif"

  // 5 - sad
  melon_songid[5] = "30617943,30457472,31149441,32586853,30189030,32115585,30232719,31481699,30617942,30285386,31481700,30457476";
  genie_songid[5] = "87415868;87185619;88072518;90194901;86866729;89472169;86931930;88455412;87415867;86990353;88455413;87185623";
  bugs_songid[5] = "30772388|30677528|31120691|31908738|30511021|31729002|30540153|31360121|30772387|30573081|31360122|30677532";
  vibe_songid[5] = "18939331,17836615,21408917,40319210,16035923,30184811,16081363,23177550,18939330,16473415,23177552,17836617";
  flo_image[5] = "/playlist/sad.gif"

  // 6 - exciting
  melon_songid[6] = "30399493,30771999,31927279,30711863,30345503,31927275,30566474,30345502,31927276,33210835,8120285,32586847,31481700,31149437,32586850,31149438,32115576";
  genie_songid[6] = "87121533;87591822;89220631;87527109;87064419;89220627;87359516;87064418;89220628;91978161;86112661;90194895;88455413;88072514;90194898;88072515;89472160";
  bugs_songid[6] = "30646154|30872542|31650953|30833862|30612024|31650949|30742600|30612023|31650950|32124930|30203513|31908732|31360122|31120687|31908735|31120688|31728993";
  vibe_songid[6] = "17735999,20121086,27852482,19738184,17409156,27852478,18676775,17409146,27852479,44037981,6049323,40319205,23177552,21408915,40319207,21408920,30165478";
  flo_image[6] = "/playlist/exciting.gif"

  // 7 - calm
  melon_songid[7] = "30232719,30617942,32115585,30189030,32586849,8120284,32115582,30285386,30658626,31295149,30507915,31481704,32586848,32892358,31481699,30772011";
  genie_songid[7] = "86931930;87415867;89472169;86866729;90194897;86112660;89472166;86990353;87463141;88233287;87264764;88455417;90194896;90756155;88455412;87591834";
  bugs_songid[7] = "30540153|30772387|31729002|30511021|31908734|30203512|31728999|30573081|30800908|31225862|30708337|31360126|31908733|32006767|31360121|30872554";
  vibe_songid[7] = "16081363,18939330,30184811,16035923,40319206,6049322,30184806,16473415,19183554,21712039,18419728,23177562,40319204,41909365,23177550,20121097";
  flo_image[7] = "/playlist/calm.gif"

  melon_songid[8] = "7844374,8120284,30189029,30232719,30284609,30345502,30399493,30457472,30507915,30566474,30617942,30658626,30711862,30772000,31149437,31295149,31481700,31927275,32115576,32586848,32892358,33210835";
  genie_songid[8] = "84964153;86112660;86866728;86931930;86990352;87064418;87121533;87185619;87264764;87359516;87415867;87463141;87527108;87591823;88072514;88233287;88455413;89220627;89472160;90194896;90756155;91978161";
  bugs_songid[8] = "4551006|30203512|30511020|30540153|30573080|30612023|30646154|30677528|30708337|30742600|30772387|30800908|30833861|30872543|31120687|31225862|31360122|31650949|31728993|31908733|32006767|32124930";
  vibe_songid[8] = "5701361,6049322,16035922,16081363,16473414,17409146,17735999,17836615,18419728,18676775,18939330,19183554,19738258,20121084,21408915,21712039,23177552,27852478,30165478,40319204,41909365,44037981";
  flo_image[8] = "/playlist/title.gif";

  melon_songid[9] = "7844372,7844373,7844374,7844375,7844376,7844377,8120282,8120283,8120284,8120285,8120286,8120287,30189029,30189030,30232719,30233080,30284609,30285386,30345502,30345503,30399493,30399494,30457471,30457472,30457476,30457484,30507915,30508688,30566474,30566475,30617942,30617943,30658626,30658627,30711862,30711863,30771999,30772000,30772011,31149436,31149437,31149438,31149439,31149440,31149441,31295149,31412373,31431163,31481699,31481700,31481701,31481702,31481703,31481704,31927274,31927275,31927276,31927277,31927278,31927279,32115575,32115576,32115577,32115578,32115579,32115580,32115581,32115582,32115583,32115584,32115585,32586847,32586848,32586849,32586850,32586851,32586852,32586853,32586854,32892355,32892356,32892357,32892358,32892359,32892360,32892361,33116872,33210835";
  genie_songid[9] = "84964151;84964152;84964153;84964154;84964155;84964156;86089284;86089285;86112660;86112661;86112662;86112663;86866728;86866729;86931930;86931931;86990352;86990353;87064418;87064419;87121533;87121534;87185618;87185619;87185623;87185631;87264764;87264765;87359516;87359517;87415867;87415868;87463141;87463142;87527108;87527109;87591822;87591823;87591834;88072513;88072514;88072515;88072516;88072517;88072518;88233287;88362467;88389337;88455412;88455413;88455414;88455415;88455416;88455417;89220626;89220627;89220628;89220629;89220630;89220631;89472159;89472160;89472161;89472162;89472163;89472164;89472165;89472166;89472167;89472168;89472169;90194895;90194896;90194897;90194898;90194899;90194900;90194901;90194902;90756152;90756153;90756154;90756155;90756156;90756157;90756158;91565584;91978161";
  bugs_songid[9] = "4551004|4551005|4551006|4551007|4551008|4551009|30203510|30203511|30203512|30203513|30203514|30203515|30511020|30511021|30540153|30540154|30573080|30573081|30612023|30612024|30646154|30646155|30677527|30677528|30677532|30677540|30708337|30708338|30742600|30742601|30772387|30772388|30800908|30800909|30833861|30833862|30872542|30872543|30872554|31120686|31120687|31120688|31120689|31120690|31120691|31225862|31304162|31318643|31360121|31360122|31360123|31360124|31360125|31360126|31650948|31650949|31650950|31650951|31650952|31650953|31728992|31728993|31728994|31728995|31728996|31728997|31728998|31728999|31729000|31729001|31729002|31908732|31908733|31908734|31908735|31908736|31908737|31908738|31908739|32006764|32006765|32006766|32006767|32006768|32006769|32006770|6029882|32124930";
  vibe_songid[9] = "5701352,5701356,5701361,5701347,5701349,5701354,6049320,6049321,6049322,6049323,6049324,6049325,16035922,16035923,16081363,16081364,16473414,16473415,17409146,17409156,17735999,17736000,17836612,17836615,17836617,17836625,18419728,18419729,18676775,18676777,18939330,18939331,19183554,19183552,19738258,19738184,20121086,20121084,20121097,21408918,21408915,21408920,21408916,21408919,21408917,21712039,22531444,22886295,23177550,23177552,23177555,23177558,23177561,23177562,27852477,27852478,27852479,27852481,27852480,27852482,30184802,30165478,30184807,30184803,30184808,30184804,30184805,30184806,30184809,30184810,30184811,40319205,40319204,40319206,40319207,40319208,40319209,40319210,40319211,41909362,41909363,41909364,41909365,41909367,41909366,41909368,43626549,44037981";
  flo_image[9] = "/playlist/all.gif";

  melon_songid[10] = "30189029,30189030,30232719,30233080,30284609,30285386,30345502,30345503,30399493,30399494,30457471,30457472,30457476,30457484,30507915,30508688,30566474,30566475,30617942,30617943,30658626,30658627,30711862,30711863,30771999,30772000,30772011";
  genie_songid[10] = "86866728;86866729;86931930;86931931;86990352;86990353;87064418;87064419;87121533;87121534;87185618;87185619;87185623;87185631;87264764;87264765;87359516;87359517;87415867;87415868;87463141;87463142;87527108;87527109;87591822;87591823;87591834";
  bugs_songid[10] = "30511020|30511021|30540153|30540154|30573080|30573081|30612023|30612024|30646154|30646155|30677527|30677528|30677532|30677540|30708337|30708338|30742600|30742601|30772387|30772388|30800908|30800909|30833861|30833862|30872542|30872543|30872554";
  vibe_songid[10] = "16035922,16035923,16081363,16081364,16473414,16473415,17409146,17409156,17735999,17736000,17836612,17836615,17836617,17836625,18419728,18419729,18676775,18676777,18939330,18939331,19183554,19183552,19738258,19738184,20121086,20121084,20121097";
  flo_image[10] = "/playlist/every-day6.gif";

  melon_songid[11] = "33210835,30345502,30566474,31927276,30233080,31295149,30399494,31412373,32892360,30507915,33116872,32892356,32586847,30566475,8120282,31927274,30345503";
  genie_songid[11] = "91978161;87064418;87359516;89220628;86931931;88233287;87121534;88362467;90756157;87264764;91565584;90756153;90194895;87359517;86089284;89220626;87064419";
  bugs_songid[11] = "32124930|30612023|30742600|31650950|30540154|31225862|30646155|31304162|32006769|30708337|6029882|32006765|31908732|30742601|30203510|31650948|30612024";
  vibe_songid[11] = "44037981,17409146,18676775,27852479,16081364,21712039,17736000,22531444,41909366,18419728,43626549,41909363,40319205,18676777,6049320,27852477,17409156";
  flo_image[11] = "/playlist/spring.gif";

  melon_songid[12] = "31927275,7844372,30711863,7844376,32115575,31149438,8120285,8120283,32115579,7844373,8120286,30457471,31927277,32892356,31149439,30345503,30399493";
  genie_songid[12] = "89220627;84964151;87527109;84964155;89472159;88072515;86112661;86089285;89472163;84964152;86112662;87185618;89220629;90756153;88072516;87064419;87121533";
  bugs_songid[12] = "31650949|4551004|30833862|4551008|31728992|31120688|30203513|30203511|31728996|4551005|30203514|30677527|31650951|32006765|31120689|30612024|30646154";
  vibe_songid[12] = "27852478,5701352,19738184,5701349,30184802,21408920,6049323,6049321,30184808,5701356,6049324,17836612,27852481,41909363,21408916,17409156,17735999";
  flo_image[12] = "/playlist/summer.gif";

  melon_songid[13] = "30617942,31149441,32586853,30285386,32586849,30232719,30457476,7844377,32115582,7844374,30617943,30658626,32892360,30507915,32115580,32586848,31431163,31481699";
  genie_songid[13] = "87415867;88072518;90194901;86990353;90194897;86931930;87185623;84964156;89472166;84964153;87415868;87463141;90756157;87264764;89472164;90194896;88389337;88455412";
  bugs_songid[13] = "30772387|31120691|31908738|30573081|31908734|30540153|30677532|4551009|31728999|4551006|30772388|30800908|32006769|30708337|31728997|31908733|31318643|31360121";
  vibe_songid[13] = "18939330,21408917,40319210,16473415,40319206,16081363,17836617,5701354,30184806,5701361,18939331,19183554,41909366,18419728,30184804,40319204,22886295,23177550";
  flo_image[13] = "/playlist/fall.gif";

  melon_songid[14] = "30189030,32586849,32115585,30232719,31431163,30772000,31927279,30771999,31481700,30457472,30399494,31927274,31927278,8120284,32892360,33116872,32892358,31481704,30772011";
  genie_songid[14] = "86866729;90194897;89472169;86931930;88389337;87591823;89220631;87591822;88455413;87185619;87121534;89220626;89220630;86112660;90756157;91565584;90756155;88455417;87591834";
  bugs_songid[14] = "30511021|31908734|31729002|30540153|31318643|30872543|31650953|30872542|31360122|30677528|30646155|31650948|31650952|30203512|32006769|6029882|32006767|31360126|30872554";
  vibe_songid[14] = "16035923,40319206,30184811,16081363,22886295,20121084,27852482,20121086,23177552,17836615,17736000,27852477,27852480,6049322,41909366,43626549,41909365,23177562,20121097";
  flo_image[14] = "/playlist/winter.gif";

  melon_songid[51] = "30189030,32586849,32115585,30232719,31431163,30772000,31927279,30771999,31481700,30457472,30399494,31927274,31927278,8120284,32892360,33116872,32892358,31481704,30772011";
  genie_songid[51] = "86866729;90194897;89472169;86931930;88389337;87591823;89220631;87591822;88455413;87185619;87121534;89220626;89220630;86112660;90756157;91565584;90756155;88455417;87591834";
  bugs_songid[51] = "30511021|31908734|31729002|30540153|31318643|30872543|31650953|30872542|31360122|30677528|30646155|31650948|31650952|30203512|32006769|6029882|32006767|31360126|30872554";
  vibe_songid[51] = "16035923,40319206,30184811,16081363,22886295,20121084,27852482,20121086,23177552,17836615,17736000,27852477,27852480,6049322,41909366,43626549,41909365,23177562,20121097";
  flo_image[51] = "/playlist/winter.gif";

  // melon : 1 // genie : 2 // bugs : 3 // vibe : 4 // flo : 5
  // site = a / theme = b

  var ok = 0;
  var icon = ["error", "success"];
  var title = ["지원하지 않는 디바이스예요.😥", "플레이리스트 생성 완료!🎉"];

  var guide_link = ["", "/guide#멜론-스트리밍-가이드", "/guide#지니-스트리밍-가이드", "/guide#벅스-스트리밍-가이드", "/guide#바이브-스트리밍-가이드", "/guide#플로-스트리밍-가이드"];
  var button_color_confirm = ["#aaa", "#3085d6"];
  var button_color_deny = ["#3085d6", "#aaa"];

  if ( mobile || ( navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 ) || site < 3 ) ok = 1; // site test
  else ok = 0;

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  Toast.fire({
    icon: icon[ok],
    title: title[ok]
  })

  if ( mobile || ( navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 ) ){
    // site 1 - 4 case
    if(site == 1 || site == 6){
      if (userAgent.search("ipad") > -1 || navigator.platform === 'MacIntel') music_site_url = melon_ipad + melon_songid[theme];
      else music_site_url = melon + melon_songid[theme];
    }
    else if(site == 2 || site == 7){
      if(userAgent.search("android") > -1) music_site_url = genie_android + genie_songid[theme];
      else music_site_url = genie_iphone + genie_songid[theme];
    }
    else if(site == 3 || site == 8) music_site_url = bugs + bugs_songid[theme];
    else if(site == 4 || site == 9) music_site_url = vibe + vibe_songid[theme];
    if(site < 5)  location.href = music_site_url;
    else if (site == 5){
      Swal.fire({
        icon: 'success',
        title: '생성 완료!🎉',
        text: '위의 이미지를 저장하고 플로에서 플레이리스트를 만드세요!',
        imageUrl: flo_image[theme],
        imageHeight: 700,
        imageAlt: 'Playlist image',
        confirmButtonText: '알겠어요',
        footer: '<a href="/intro#플로-플레이리스트-이용-방법" style="color:#28acff">어떻게 플레이리스트를 만드나요?</a>'
      });
    }
    if (site > 5 && site < 10){
      Swal.fire({
        icon: 'success',
        title: '생성 완료!🎉',
        text: '혹시 스트리밍 가이드를 확인하셨나요? 아직 확인하지 않으셨다면 가이드를 먼저 확인해주세요!🍋',
        showDenyButton: true,
        focusConfirm: false,
        focusDeny: true,
        confirmButtonText: '바로 담기',
        denyButtonText: '가이드 보기',
        confirmButtonColor: '#aab7c1',
        denyButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          location.href = music_site_url;
        } else if (result.isDenied) {
          location.href = guide_link[site-5];
        }
      })
    }
    else if (site == 10){
      Swal.fire({
        icon: 'success',
        title: '생성 완료!🎉',
        text: '혹시 스트리밍 가이드를 확인하셨나요? 아직 확인하지 않으셨다면 가이드를 먼저 확인해주세요!🍋',
        imageUrl: flo_image[theme],
        imageHeight: 700,
        imageAlt: 'Playlist image',
        showDenyButton: true,
        focusConfirm: false,
        focusDeny: true,
        confirmButtonText: '괜찮아요',
        denyButtonText: '가이드 보기',
        confirmButtonColor: '#aab7c1',
        denyButtonColor: '#3085d6',
        footer: '<a href="/intro#플로-플레이리스트-이용-방법" style="color:#28acff">어떻게 플레이리스트를 만드나요?</a>'
      }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.isDenied) {
          location.href = guide_link[site-5];
        }
      })
    }
  }
  else{
    if(site == 1 || site == 6){
      if (userAgent.search("macintosh") > -1) music_site_url = melon_mac_1 + melon_songid[theme] + melon_mac_2;
      else music_site_url = melon_win + melon_songid[theme];
      if (theme != 51) location.href = music_site_url;
    }
    else if(site == 2 || site == 7) if (theme != 51) window.open( genie_web + genie_songid[theme], '', 'scrollbars=no, width=600, height=600');
    if(site == 6){
      Swal.fire({
        icon: 'success',
        title: '멜론 플레이리스트 생성 완료!',
        text: '혹시 가이드를 확인하셨나요? 아직 확인하지 않으셨다면 가이드를 먼저 확인해주세요!🍋',
        showDenyButton: true,
        confirmButtonText: '바로 담기',
        denyButtonText: '가이드 보기',
        confirmButtonColor: '#aaa',
        denyButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          location.href = music_site_url;
        } else if (result.isDenied) {
          location.href = guide_link[site];
        }
      })
    }
    else if(site == 7){
      Swal.fire({
        icon: 'success',
        title: '지니 플레이리스트 생성 완료!',
        text: '혹시 가이드를 확인하셨나요? 아직 확인하지 않으셨다면 가이드를 먼저 확인해주세요!🍋',
        showDenyButton: true,
        confirmButtonText: '바로 담기',
        denyButtonText: '가이드 보기',
        confirmButtonColor: '#aaa',
        denyButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          window.open( genie_web + genie_songid[theme], '', 'scrollbars=no, width=600, height=600');
        } else if (result.isDenied) {
          location.href = guide_link[site];
        }
      })
    }
  }
}
