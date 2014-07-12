!function(){"use strict";var e="undefined"!=typeof window?window:global;if("function"!=typeof e.require){var r={},t={},n=function(e,r){return{}.hasOwnProperty.call(e,r)},a=function(e,r){var t,n,a=[];t=/^\.\.?(\/|$)/.test(r)?[e,r].join("/").split("/"):r.split("/");for(var i=0,s=t.length;s>i;i++)n=t[i],".."===n?a.pop():"."!==n&&""!==n&&a.push(n);return a.join("/")},i=function(e){return e.split("/").slice(0,-1).join("/")},s=function(r){return function(t){var n=i(r),s=a(n,t);return e.require(s,r)}},o=function(e,r){var n={id:e,exports:{}};return t[e]=n,r(n.exports,s(e),n),n.exports},u=function(e,i){var s=a(e,".");if(null==i&&(i="/"),n(t,s))return t[s].exports;if(n(r,s))return o(s,r[s]);var u=a(s,"./index");if(n(t,u))return t[u].exports;if(n(r,u))return o(u,r[u]);throw new Error('Cannot find module "'+e+'" from "'+i+'"')},c=function(e,t){if("object"==typeof e)for(var a in e)n(e,a)&&(r[a]=e[a]);else r[e]=t},m=function(){var e=[];for(var t in r)n(r,t)&&e.push(t);return e};e.require=u,e.require.define=c,e.require.register=c,e.require.list=m,e.require.brunch=!0}}(),require.register("application",function(e,r,t){var n=r("config"),a=r("utils").normalizeRates,i=window.require.list().filter(function(e){return/^countries/.test(e)}).map(r).map(function(e){return e.rates&&e.rates.forEach(function(e){null==e.max&&(e.max=1/0)}),e}),s=n.currencies.sorter,o=n.currencies.symbols,u=i.map(function(e){return e.code}).uniq().map(function(e){return o[e]||(o[e]=e),{code:e,symbol:o[e]}}).sort(function(e,r){var t=s.indexOf(e.code),n=s.indexOf(r.code);return-1===t&&(t=1e3),-1===n&&(n=1e3),t-n}),c=Ember.Application.create({rootElement:"#app",ready:function(){console.log("The app is started"),$(".loader").hide()}});window.App=c,c.deferReadiness(),["components","controllers","helpers","models","routes"].forEach(r);var m=i.map(function(e){e.rates=a(e);var r=c.Country.create(e),t=(r.states||[]).map(function(e){return e.country=r,e.rates=a(e),c.CountryState.create(e)});return r.set("states",t),r});c.CURRENCIES=u,c.COUNTRIES=m,Ember.TextField.reopen({attributeBindings:["autofocus","autocomplete"]}),t.exports=window.App=c}),require.register("components",function(e,r){var t=r("config").currencies.symbols,n=r("utils");App.SubjectiveBaseComponent=Ember.Component.extend({tagName:"b",classNameBindings:["descriptionClass"],descriptionClass:function(){return this.get("description").replace(/\s+/g,"-")}.property("description")}),App.SubjectiveClimateComponent=App.SubjectiveBaseComponent.extend({layout:Ember.Handlebars.compile("{{description}}"),climate:null,avg:function(){return(this.get("climate.high")+this.get("climate.low"))/2}.property("climate.{high,low}"),description:function(){return n.subjectiveWord("climate",this.get("avg"))}.property("avg")}),App.CountryRatingComponent=Ember.Component.extend({name:null,rating:null,sources:{crime:"http://www.numbeo.com/crime/rankings_by_country.jsp",prices:"http://www.numbeo.com/cost-of-living/rankings_by_country.jsp",business:"http://www.doingbusiness.org/rankings",corruption:"http://cpi.transparency.org/cpi2013/results/"},labels:{crime:"Crime index",prices:"Consumer price index",business:"Doing business",corruption:"Corruption perception"},source:function(){var e=this.get("name");return this.get("sources")[e]}.property("name","sources"),label:function(){var e=this.get("name");return this.get("labels")[e]}.property("name","labels")}),App.TaxBandsComponent=Ember.Component.extend({countryOrState:null,currencyCode:null,currency:function(){return t[this.get("currencyCode")]}.property("currencyCode"),sourceCurrencyCode:Ember.computed.alias("countryOrState.code"),rates:Ember.computed.alias("countryOrState.rates"),isFlatTax:Ember.computed.alias("countryOrState.isFlatTax"),flatTaxRate:Ember.computed.alias("countryOrState.flatTaxRate"),bands:function(){var e=this.get("rates").slice(),r=this.get("currencyCode"),t=this.get("sourceCurrencyCode");return e.shift(),e.map(function(e){var a=n.toCurrency(e.max,r,t);return{max:a,rate:e.rate}})}.property("rates","currencyCode","sourceCurrencyCode")}),App.SampleRatesComponent=Ember.Component.extend({countryOrState:null,currencyCode:null,demoIncome:null,currency:function(){return t[this.get("currencyCode")]}.property("currencyCode"),sampleIncomes:function(){var e=this.get("currencyCode"),r=[25e3,5e4,75e3,1e5,25e4,5e5,1e6];return r.map(function(r){return n.toCurrency(r,e,"USD")})}.property("currencyCode"),samples:function(){var e=this.get("countryOrState"),r=this.get("currencyCode");return this.get("sampleIncomes").map(function(t){return App.TaxCalculator.calculateTotalWithStats(e,t,r)})}.property("countryOrState","sampleIncomes"),result:function(){var e=this.get("demoIncome"),r=this.get("countryOrState"),t=this.get("currencyCode");return App.TaxCalculator.calculateTotalWithStats(r,e,t)}.property("countryOrState","demoIncome")}),App.MoneyInputComponent=Ember.Component.extend({currencyCode:null,value:null,placeholder:null,autofocus:!1,debounce:null,setFmt:function(){this.updateMoney()}.on("init"),fmtValue:null,updateMoney:function(){this.set("fmtValue",accounting.formatNumber(this.get("value")))}.observes("value"),inputValueDidChange:function(){this.set("fmtValue",accounting.formatNumber(this.get("fmtValue")));var e=this.get("debounce");e?Ember.run.debounce(this,this.updateValue,e):this.updateValue()}.observes("fmtValue"),updateValue:function(){this.set("value",accounting.unformat(this.get("fmtValue")))}}),App.CheckMarkComponent=Ember.Component.extend({tagName:"span",value:null}),App.BsPanelComponent=Ember.Component.extend({classNames:["panel panel-default"]}),App.VisaCardComponent=Ember.Component.extend({visa:null,title:null}),App.SubjectiveRatingComponent=App.SubjectiveBaseComponent.extend({layout:Ember.Handlebars.compile("{{#if rating}}{{description}} ({{numDesc}}){{else}}&emdash;{{/if}}"),name:null,rating:null,isBusiness:Ember.computed.equal("name","business"),isCorruption:Ember.computed.equal("name","corruption"),numDesc:function(){var e=this.get("rating");return this.get("isBusiness")?"#"+e:this.get("isCorruption")?e+" / 100":e}.property("rating","isBusiness"),description:function(){return n.subjectiveWord(this.get("name"),this.get("rating"))}.property("name","rating")}),App.TotalRatingComponent=App.SubjectiveBaseComponent.extend({layout:Ember.Handlebars.compile("{{description}}"),ratings:null,description:function(){return n.subjectiveWord("total",this.get("ratings"))}.property("name","rating")})}),require.register("config",function(e,r,t){t.exports={currencies:{url:"http://openexchangerates.org/api/latest.json?app_id=8556217a83d84985930d67d6cf934289",symbols:{USD:"US$",CAD:"CA$",HKD:"HK$",SGD:"SG$",AUD:"AU$",THB:"฿",JPY:"¥",GBP:"£",EUR:"€",CZK:"Kč",UAH:"₴",BTC:"BTC"},sorter:["USD","EUR","GBP","RUB","UAH","BTC"]},subjectiveWords:{crime:["very high","high","moderate","low","very low"],prices:["very expensive","expensive","moderate","cheap","very cheap"],business:["very hard","hard","moderate","easy","very easy"],corruption:["very bad","bad","moderate","good","very good"],total:["very bad","bad","moderate","good","very good"]}}}),require.register("controllers",function(e,r){var t=r("config").currencies.symbols;App.ApplicationController=Ember.Controller.extend({currencyCode:"USD"}),App.NavbarController=Ember.Controller.extend({needs:["application"],currencyCode:Ember.computed.alias("controllers.application.currencyCode")}),App.RatingsController=Ember.ArrayController.extend({}),App.FilterSet=Ember.Object.extend({noEducationWorkVisa:!1,allFiltersChanged:function(){this.notifyPropertyChange("allFilters")}.observes("noEducationWorkVisa"),doesMatch:function(e){var r=this.get("noEducationWorkVisa"),t=!r;if(t)return!0;var n=e.get("immigration.work");return n.degreeReq===!1}}),App.ChooseDestinyController=Ember.ArrayController.extend({filterSet:function(){return App.FilterSet.create()}.property(),results:function(){var e=this.get("model"),r=this.get("filterSet");return e.filter(function(e){return r.doesMatch(e)})}.property("@each","filterSet.allFilters")}),App.TaxRatingController=Ember.Controller.extend({needs:["application"],queryParams:["income","currencyCode"],currencyCode:Ember.computed.alias("controllers.application.currencyCode"),income:null,currency:function(){return t[this.get("currencyCode")]}.property("currencyCode"),results:function(){var e=this;return App.COUNTRIES.reduce(function(e,r){return e.concat(r.get("hasStates")?r.get("states"):[r])},[]).map(function(r){var t,n;return r.get("isCountry")?t=r:(t=r.get("country"),n=r),App.CalculationEntry.create({country:t,state:n,source:e,incomeBinding:"source.income",currencyCodeBinding:"source.currencyCode"})})}.property(),actions:{setIncome:function(e){this.set("currencyCode","USD"),this.set("income",e)}}}),App.ResultsController=Ember.ArrayController.extend({sortProperties:["taxAmount"],needs:["tax_rating"],currencyCode:Ember.computed.alias("controllers.tax_rating.currencyCode"),currency:Ember.computed.alias("controllers.tax_rating.currency")}),App.DetailsController=Ember.ObjectController.extend({needs:["application"],currencyCode:Ember.computed.alias("controllers.application.currencyCode"),country:Ember.computed.alias("model"),state:null,countryOrState:function(){return this.get(this.get("state")?"state":"country")}.property("country","state")})}),require.register("countries/australia",function(e,r,t){t.exports={name:"Australia",slug:"australia",code:"AUD",ratings:{crime:41.23,prices:108.51,business:11,corruption:81},immigration:{work:!1,investment:!1,business:!1},ratesSource:"https://en.wikipedia.org/wiki/Income_tax_in_Australia#Individual_income_tax_rates_.28residents.29",rates:["incremental",{max:18200,rate:0},{max:37e3,rate:19},{max:8e4,rate:32.5},{max:18e4,rate:37},{max:null,rate:45}]}}),require.register("countries/austria",function(e,r,t){t.exports={name:"Austria",slug:"austria",code:"EUR",ratings:{crime:25.83,prices:89.5,business:30,corruption:69},immigration:{work:!1,investment:{minAmount:3e6,yearsBeforeCitizenship:"0",source:"http://best-citizenships.com/austria-citizenship.htm"},business:!1},ratesSource:"http://europa.eu/youreurope/citizens/work/retire/taxes/austria/index_en.htm",rates:["incremental",{max:10999,rate:0},{max:25e3,rate:36.5},{max:6e4,rate:43.2},{max:null,rate:50}]}}),require.register("countries/belarus",function(e,r,t){t.exports={name:"Belarus",slug:"belarus",code:"BYR",ratings:{crime:32.89,prices:50.35,business:63,corruption:29},immigration:{work:!1,investment:!1,business:!1},rate:12}}),require.register("countries/canada",function(e,r,t){t.exports={name:"Canada",slug:"canada",code:"CAD",ratings:{crime:36.29,prices:87.9,business:19,corruption:81},immigration:{work:{degreeReq:!1,source:"http://www.workpermit.com/canada/individual/skilled.htm"},investment:{minAmount:8e5,yearsBeforePR:0,source:"http://news.gc.ca/web/article-en.do?nid=814939"},business:{source:"http://www.cic.gc.ca/english/immigrate/business/start-up/eligibility.asp#language",specialConditions:["Startup visa.","Must have min $11824 in bank for settlement","You must secure a minimum investment of $200,000 if the investment comes from a designated Canadian venture capital fund.","You must secure a minimum investment of $75,000 if the investment comes from a designated Canadian angel investor group.","You may proceed with no investment if you're in business incubator.","Alternative: visa for self-employed persons"]}},ratesSource:"http://www.cra-arc.gc.ca/tx/ndvdls/fq/txrts-eng.html",rates:["incremental",{max:43561,rate:15},{max:87123,rate:22},{max:135054,rate:26},{max:null,rate:29}],states:[{name:"Quebec",slug:"qc",rates:["incremental",{max:41095,rate:16},{max:82190,rate:20},{max:1e5,rate:24},{max:null,rate:25.75}]},{name:"Ontario",slug:"on",rates:["incremental",{max:39723,rate:5.05},{max:79448,rate:9.15},{max:509e3,rate:11.16},{max:null,rate:13.16}]},{name:"Manitoba",slug:"mb",rates:["incremental",{max:31e3,rate:10.8},{max:67e3,rate:12.75},{max:null,rate:17.4}]},{name:"Alberta",slug:"ab",rate:10},{name:"British Columbia",slug:"bc",rates:["incremental",{max:37568,rate:5.06},{max:71138,rate:7.7},{max:82268,rate:10.5},{max:104754,rate:12.29},{max:null,rate:14.7}]}]}}),require.register("countries/china",function(e,r,t){t.exports={name:"China",slug:"china",code:"CNY",ratings:{crime:30.13,prices:54.12,business:96,corruption:40},immigration:{work:!1,investment:!1,business:!1},ratesSource:"https://en.wikipedia.org/wiki/Taxation_in_China#Individual_income_tax",rates:["incremental",{max:1500,rate:3},{max:4500,rate:10},{max:9e3,rate:20},{max:35e3,rate:25},{max:55e3,rate:30},{max:8e4,rate:35},{max:null,rate:45}]}}),require.register("countries/cyprus",function(e,r,t){t.exports={name:"Cyprus",slug:"cyprus",code:"EUR",ratings:{crime:37.56,prices:89.76,business:39,corruption:63},immigration:{work:!1,investment:{minAmount:3e6,yearsBeforeCitizenship:"0",source:"http://best-citizenships.com/cyprus-citizenship.htm"},business:!1},rates:["incremental",{max:19500,rate:0},{max:28e3,rate:20},{max:36300,rate:25},{max:6e4,rate:30},{max:null,rate:35}]}}),require.register("countries/czech-republic",function(e,r,t){t.exports={name:"Czech Republic",slug:"czech-republic",code:"CZK",ratings:{crime:33.88,prices:56.59,business:75,corruption:48},immigration:{work:!1,investment:!1,business:{minCapital:2e5,yearsBeforePR:5,yearsBeforeCitizenship:5,stayReq:90,source:"http://business-investor-immigration.com/czech-business-immigration-program/"}},rate:15}}),require.register("countries/france",function(e,r,t){t.exports={name:"France",slug:"france",code:"EUR",ratings:{crime:47.28,prices:100.21,business:38,corruption:71},immigration:{work:!1,investment:!1,business:!1},ratesSource:"https://en.wikipedia.org/wiki/Taxation_in_France#Income_Taxes",rates:["incremental",{max:6011,rate:0},{max:11991,rate:5.5},{max:26631,rate:14},{max:71397,rate:30},{max:151200,rate:41},{max:null,rate:45}]}}),require.register("countries/georgia",function(e,r,t){t.exports={name:"Georgia",slug:"georgia",code:"GEL",ratings:{crime:19.91,prices:46.22,business:8,corruption:49},immigration:{work:!1,investment:!1,business:!1},rate:20}}),require.register("countries/germany",function(e,r,t){t.exports={name:"Germany",slug:"germany",code:"EUR",ratings:{crime:27.14,prices:87.14,business:21,corruption:78},immigration:{work:{degreeReq:!1,canApplyForPR:!0,yearsBeforePR:5,source:"http://www.internations.org/germany-expats/guide/15983-visa-administration/how-to-get-a-german-residence-permit-15953"},investment:{minAmount:25e4,minJobs:5,source:"http://en.wikipedia.org/wiki/Immigration_to_Germany"},business:!1},ratesSource:"http://www.parmentier.de/steuer/steuer.htm?wagetax.htm",rates:["incremental",{max:8130,rate:0},{max:52881,rate:14},{max:250731,rate:42},{max:null,rate:45}]}}),require.register("countries/hong-kong",function(e,r,t){t.exports={name:"Hong Kong",slug:"hong-kong",code:"HKD",ratings:{crime:22.68,prices:76.36,business:2,corruption:75},climate:{high:31.4,low:14.5,rainyDays:137},immigration:{work:{degreeReq:!0,canApplyForPR:!0,source:"http://www.clic.org.hk/en/topics/immigration/hk_permanent_residence/"},investment:{minAmount:1e7,yearsBeforePR:7,source:"http://www.second-citizenship.org/permanent-residence/immigration-through-investment-to-hong-kong/"},business:!1},rates:["simple",{max:4e4,rate:2},{max:8e4,rate:7},{max:12e4,rate:12},{max:null,rate:17}]}}),require.register("countries/iceland",function(e,r,t){t.exports={name:"Iceland",slug:"iceland",code:"ISK",ratings:{crime:31.68,prices:111.75,business:13,corruption:78},immigration:{work:!1,investment:!1,business:!1},rates:["incremental",{max:2512800,rate:37.31},{max:8166600,rate:40.21},{max:null,rate:46.21}]}}),require.register("countries/ireland",function(e,r,t){t.exports={name:"Ireland",slug:"ireland",code:"EUR",ratings:{crime:53.59,prices:106.61,business:15,corruption:72},immigration:{work:!1,investment:!1,business:!1},ratesSource:"https://en.wikipedia.org/wiki/Taxation_in_the_Republic_of_Ireland#Rates_of_income_tax",rates:["incremental",{max:32800,rate:20},{max:null,rate:41}]}}),require.register("countries/israel",function(e,r,t){t.exports={name:"Israel",slug:"israel",code:"ILS",ratings:{crime:33.28,prices:91.45,business:35,corruption:61},climate:{high:30,low:9,rainyDays:45},immigration:{work:{canApplyForPR:!0,source:"http://www.justlanded.com/english/Israel/Israel-Guide/Visas-Permits/Visas"},investment:{specialConditions:["Only for U.S. investors"]},business:!1},ratesSource:"https://en.wikipedia.org/wiki/Taxation_in_Israel#Personal_Income_tax",rates:["incremental",{max:62400,rate:10},{max:106560,rate:14},{max:173160,rate:21},{max:261360,rate:30},{max:501960,rate:33},{max:null,rate:48}]}}),require.register("countries/italy",function(e,r,t){t.exports={name:"Italy",slug:"italy",code:"EUR",ratings:{crime:45.59,prices:96.81,business:65,corruption:43},immigration:{work:!1,investment:!1,business:!1},ratesSource:"https://en.wikipedia.org/wiki/Taxation_in_Italy",rates:["incremental",{max:15e3,rate:23},{max:28e3,rate:27},{max:55e3,rate:38},{max:75e3,rate:41},{max:null,rate:43}]}}),require.register("countries/japan",function(e,r,t){t.exports={name:"Japan",slug:"japan",code:"JPY",ratings:{crime:18.1,prices:94.13,business:27,corruption:74},immigration:{work:!1,investment:!1,business:!1},rates:["incremental",{max:195e4,rate:5},{max:33e5,rate:10},{max:695e4,rate:20},{max:9e6,rate:23},{max:18e6,rate:33},{max:null,rate:40}]}}),require.register("countries/latvia",function(e,r,t){t.exports={name:"Latvia",slug:"latvia",code:"EUR",ratings:{crime:43.74,prices:65.95,business:24,corruption:53},immigration:{work:!1,investment:!1,business:!1},rate:24}}),require.register("countries/malaysia",function(e,r,t){t.exports={name:"Malaysia",slug:"malaysia",code:"MYR",ratings:{crime:66.41,prices:48.66,business:6,corruption:50},immigration:{work:!1,investment:!1,business:!1},ratesSource:"http://savemoney.my/malaysia-personal-income-tax-guide-2013-rates-exemptions-rebates-reliefs-and-more/",rates:["incremental",{max:2500,rate:0},{max:5e3,rate:1},{max:1e4,rate:3},{max:2e4,rate:3},{max:35e3,rate:7},{max:5e4,rate:12},{max:7e4,rate:19},{max:1e5,rate:24},{max:null,rate:26}]}}),require.register("countries/netherlands",function(e,r,t){t.exports={name:"Netherlands",slug:"netherlands",code:"EUR",ratings:{crime:37.07,prices:98.82,business:28,corruption:83},immigration:{work:!1,investment:!1,business:!1},ratesSource:"http://en.wikipedia.org/wiki/Income_tax_in_the_Netherlands#Progressive_tax_on_wages_etc._.28box_1.29",rates:["incremental",{max:19645,rate:5.85},{max:33363,rate:10.85},{max:55991,rate:42},{max:null,rate:52}]}}),require.register("countries/poland",function(e,r,t){t.exports={name:"Poland",slug:"poland",code:"PLN",ratings:{crime:37.53,prices:53.68,business:45,corruption:60},immigration:{work:!1,investment:!1,business:!1},ratesSource:"http://europa.eu/youreurope/citizens/work/abroad/taxes/poland/employed_en.htm",rates:["incremental",{max:3091,rate:0},{max:85528,rate:18},{max:null,rate:32}]}}),require.register("countries/russia",function(e,r,t){t.exports={name:"Russia",slug:"russia",code:"RUB",ratings:{crime:52.67,prices:61.8,business:92,corruption:28},immigration:{work:!1,investment:!1,business:!1},rate:13}}),require.register("countries/singapore",function(e,r,t){t.exports={name:"Singapore",slug:"singapore",code:"SGD",ratings:{crime:21.35,prices:100.01,business:1,corruption:86},immigration:{work:{degreeReq:!1,canApplyForPR:!0},investment:{minAmount:25e5,yearsBeforePR:0,yearsBeforeCitizenship:2},business:{minCapital:5e4,minShare:30,specialConditions:["The company is receiving monetary funding or investment of at least S$100,000 from a third-party Venture Capitalist (VC) or angel investor accredited by a Singapore Government agency.","The company holds an Intellectual Property (IP) that is registered with a recognised national IP institution.","The company has on-going research collaboration with an institution recognised by Agency for Science, Technology and Research (A*STAR) or Institutes of Higher Learning in Singapore.","The company is an incubatee at a Singapore Government-supported incubator."],source:"http://www.guidemesingapore.com/relocation/work-pass/singapore-entrepreneur-pass-guide"}},climate:{high:31,low:24.1,rainyDays:178},rates:["incremental",{max:2e4,rate:0},{max:3e4,rate:2},{max:4e4,rate:3.5},{max:8e4,rate:7},{max:12e4,rate:11.5},{max:16e4,rate:15},{max:2e5,rate:17},{max:32e4,rate:18},{max:null,rate:20}]}}),require.register("countries/south-korea",function(e,r,t){t.exports={name:"South Korea",slug:"south-korea",code:"KRW",ratings:{crime:16.35,prices:87.56,business:7,corruption:55},immigration:{work:!1,investment:!1,business:!1},ratesSource:"http://www.korea4expats.com/article-income-taxes.html",rates:["incremental",{max:12e6,rate:6},{max:46e6,rate:16},{max:88e6,rate:25},{max:null,rate:35}]}}),require.register("countries/spain",function(e,r,t){t.exports={name:"Spain",slug:"spain",code:"EUR",ratings:{crime:32.42,prices:77.81,business:52,corruption:59},immigration:{work:!1,investment:!1,business:!1},ratesSource:"https://en.wikipedia.org/wiki/Income_tax_in_Spain",rates:["incremental",{max:17707.2,rate:24},{max:33007.2,rate:28},{max:53407.2,rate:37},{max:120000.2,rate:43},{max:175000.2,rate:44},{max:null,rate:45}]}}),require.register("countries/sweden",function(e,r,t){t.exports={name:"Sweden",slug:"sweden",code:"SEK",ratings:{crime:38.23,prices:103.68,business:14,corruption:89},immigration:{work:!1,investment:!1,business:!1},rates:["incremental",{max:413200,rate:30},{max:591600,rate:50},{max:null,rate:55}]}}),require.register("countries/thailand",function(e,r,t){t.exports={name:"Thailand",slug:"thailand",code:"THB",ratings:{crime:37.56,prices:45.95,business:19,corruption:35},immigration:{work:!1,investment:!1,business:!1},ratesSource:"http://www.rd.go.th/publish/6045.0.html",rates:["incremental",{max:15e4,rate:0},{max:5e5,rate:10},{max:1e6,rate:20},{max:4e6,rate:30},{max:null,rate:37}]}}),require.register("countries/uae",function(e,r,t){t.exports={name:"United Arab Emirates",slug:"uae",code:"AED",ratings:{crime:20.79,prices:68.25,business:23,corruption:69},immigration:{work:!1,investment:!1,business:!1},rate:0}}),require.register("countries/uk",function(e,r,t){t.exports={name:"United Kingdom",slug:"uk",code:"GBP",ratings:{crime:42.62,prices:100.11,business:10,corruption:76},immigration:{work:!1,investment:!1,business:!1},ratesSource:"https://en.wikipedia.org/wiki/Taxation_in_the_United_Kingdom#Income_tax",rates:["incremental",{max:32011,rate:20},{max:15e4,rate:40},{max:null,rate:45}]}}),require.register("countries/ukraine",function(e,r,t){t.exports={name:"Ukraine",slug:"ukraine",code:"UAH",ratings:{crime:49.37,prices:45.64,business:112,corruption:25},immigration:{work:!1,investment:!1,business:!1},rates:["simple",{max:12180,rate:15},{max:null,rate:17}]}}),require.register("countries/usa",function(e,r,t){t.exports={name:"United States",slug:"usa",code:"USD",ratings:{crime:50.15,prices:77.39,business:4,corruption:73},immigration:{work:{degreeReq:!0,canApplyForPR:!0,quota:65e3,source:"http://www.uscis.gov/working-united-states/temporary-workers/h-1b-specialty-occupations-and-fashion-models/h-1b-specialty-occupations-dod-cooperative-research-and-development-project-workers-and-fashion-models"},investment:{minAmount:1e6,minJobs:10,yearsBeforePR:2,source:"http://www.uscis.gov/working-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/eb-5-immigrant-investor-process"},business:!1},ratesSource:"http://www.worldwide-tax.com/us/us_taxes.asp",rates:["incremental",{max:8925,rate:0},{max:36250,rate:15},{max:87850,rate:25},{max:183250,rate:28},{max:398350,rate:33},{max:4e5,rate:35},{max:null,rate:39.6}],states:[{name:"Alaska / Florida / Nevada / Texas",slug:"ak-fl-nv-tx",rate:0},{name:"California",slug:"ca",rates:["incremental",{max:7455,rate:0},{max:17676,rate:2},{max:27897,rate:4},{max:38726,rate:6},{max:48942,rate:8},{max:25e4,rate:9.3},{max:3e5,rate:10.3},{max:5e5,rate:11.3},{max:null,rate:12.3}]},{name:"Delaware",slug:"de",rates:["incremental",{max:2e3,rate:0},{max:5e3,rate:2.2},{max:1e4,rate:3.9},{max:2e4,rate:4.8},{max:25e3,rate:5.2},{max:6e4,rate:5.55},{max:null,rate:6.75}]},{name:"Kentucky",slug:"ky",rates:["incremental",{max:3e3,rate:2},{max:4e3,rate:3},{max:5e3,rate:4},{max:8e3,rate:5},{max:75e3,rate:5.8},{max:null,rate:6}]},{name:"New York",slug:"ny",rates:["incremental",{max:8e3,rate:4},{max:11e3,rate:4.5},{max:13e3,rate:5.25},{max:2e4,rate:5.9},{max:75e3,rate:6.45},{max:2e5,rate:6.65},{max:1e6,rate:6.85},{max:null,rate:8.72}]}]}}),require.register("helpers",function(e,r){var t=r("utils");Ember.Handlebars.helper("number",function(e){return accounting.formatNumber(e)}),Ember.Handlebars.helper("rawPercent",function(e){return accounting.formatNumber(e,2)+"%"}),Ember.Handlebars.helper("percent",function(e){return accounting.formatNumber(100*e,2)+"%"}),Ember.Handlebars.helper("yesno",function(e){return e?"yes":"no"}),Ember.Handlebars.helper("money",function(e){return 1/0===e?"Infinity":accounting.formatMoney(e,"")}),Ember.Handlebars.helper("multi-money",function(e,r,n){var a=t.toCurrency(e,n,r),i=function(e,r){return accounting.formatMoney(e,r+"&nbsp;")};return new Ember.Handlebars.SafeString(i(e,r)+" ("+i(a,n)+")")}),Ember.Handlebars.helper("subj-climate",App.SubjectiveClimateComponent),Ember.Handlebars.helper("subj-rating",App.SubjectiveRatingComponent),Ember.Handlebars.helper("total-rating",App.TotalRatingComponent)}),require.register("init",function(e,r){var t=r("application"),n=r("config").currencies.url;$.getJSON(n,function(e){if(!fx)throw new Error("Provide money.js library");fx.rates=e.rates,fx.base=e.base,t.advanceReadiness()})}),require.register("models",function(e,r){var t=r("utils");App.Taxable=Ember.Mixin.create({rates:null,taxBrackets:function(){var e=this.get("rates").slice();return e.shift(),e}.property("rates"),isFlatTax:Ember.computed.equal("taxBrackets.length",1),flatTaxRate:Ember.computed.alias("taxBrackets.firstObject.rate")}),App.Country=Ember.Object.extend(App.Taxable,{name:null,slug:null,code:null,prosperityIndexRank:null,ratesSource:null,states:null,immigration:null,hasStates:Ember.computed.notEmpty("states"),isCountry:!0,isState:!1,flagURL:function(){return"flags/"+this.get("name").replace(/ /g,"-")+".png"}.property("name")}),App.CountryState=Ember.Object.extend(App.Taxable,{country:null,name:null,slug:null,code:Ember.computed.alias("country.code"),isCountry:!1,isState:!0}),App.TaxCalculator=Ember.Object.extend({calculateTotalFor:function(e,r,t){var n=e.get("isState"),a=n?e.get("country"):e,i=n?e:null,s=this.calculateFor(a,r,t),o=n?this.calculateFor(i,r,t):0;return s+o},calculateTotalWithStats:function(e,r,t){var n=this.calculateTotalFor(e,r,t),a=n/r,i=r-n;return{income:r,taxAmount:n,effectiveRate:a,takeHome:i,currency:t}},calculateFor:function(e,r,n){return t.getRate(r,n,e.get("code"),e.get("rates"))}}).create(),App.CalculationEntry=Ember.Object.extend({country:null,state:null,income:null,currencyCode:null,countryOrState:function(){return this.get("state")||this.get("country")}.property("country","state"),result:function(){var e=this.get("countryOrState"),r=this.get("income"),t=this.get("currencyCode");return App.TaxCalculator.calculateTotalWithStats(e,r,t)}.property("countryOrState","income","currencyCode"),taxAmount:Ember.computed.alias("result.taxAmount"),effectiveRate:Ember.computed.alias("result.effectiveRate"),takeHome:Ember.computed.alias("result.takeHome")})}),require.register("routes",function(){App.Router.map(function(){this.resource("tax-rating",{path:"/taxes"}),this.resource("ratings"),this.resource("choose-destiny"),this.resource("details",{path:"/c/:country_slug"}),this.resource("details_state",{path:"/c/:country_slug/:state_slug"})}),App.RatingsRoute=Ember.Route.extend({model:function(){return App.COUNTRIES}}),App.DetailsRoute=Ember.Route.extend({model:function(e){return App.COUNTRIES.findBy("slug",e.country_slug)}}),App.ChooseDestinyRoute=Ember.Route.extend({model:function(){return App.COUNTRIES}}),App.DetailsStateRoute=Ember.Route.extend({controllerName:"details",model:function(e){var r=App.COUNTRIES.findBy("slug",e.country_slug),t=r.get("states").findBy("slug",e.state_slug);return[r,t]},setupController:function(e,r){e.set("model",r[0]),e.set("state",r[1])},renderTemplate:function(){this.render("details")}})}),require.register("utils",function(e,r){var t=r("config");e.toCurrency=function(e,r,t){return e?fx(e).from(t).to(r):0};var n=function(e,r,t){return e?fx(e).from(r).to(t):0},a=function(e,r){if("crime"===e)return r>75?0:r>50?1:r>35?2:r>25?3:4;if("prices"===e)return r>110?0:r>85?1:r>65?2:r>50?3:4;if("business"===e)return r>120?0:r>80?1:r>60?2:r>25?3:4;if("corruption"===e)return r>75?4:r>60?3:r>45?2:r>30?1:0;if("total"===e){var t=0;for(var n in r)t+=a(n,r[n]);return console.log(t),t>=20?4:t>=15?3:t>=10?2:t>=5?1:0}throw new Error("Unknown rating: "+e)};e.subjectiveWord=function(e,r){if("crime"===e||"prices"===e||"business"===e||"corruption"===e||"total"===e){var n=a(e,r);return t.subjectiveWords[e][n]}if("climate"===e)return r>20?"very hot":r>0?"moderate":"cold";throw new Error("Unknown rating: "+e)};var i=function(e,r){r=r.slice();var t=r.shift();if("incremental"==t){var n=r.any(function(e){return 1/0==e.max});if(!n)throw new Error("Country must have max income bracket");var a=r.map(function(e,t){var n=r[t-1]||{},a=n.max||0;return{min:a,max:e.max,rate:e.rate,fixed:e.fixed||0}}).filter(function(r){return e>r.min}),i=a.map(function(r){var t=r.max>e?e:r.max,n=t-r.min,a=n*r.rate/100+r.fixed;return a}),s=i.reduce(function(e,r){return e+r},0);return s}var o=r.slice().reverse(),u=o.find(function(r){return e<r.max});if(u)return e*u.rate/100;throw new Error("No rate matches the value "+e)};e.getRate=function(r,t,a,s){if(!s)return 0;var o=n(r,t,a),u=i(o,s);return e.toCurrency(u,t,a)};var s=function(e){e.rates&&e.rates.forEach(function(e){null==e.max&&(e.max=1/0)})};e.normalizeRates=function(e){return e.rates?(s(e),(e.states||[]).map(s),e.rates):["simple",{max:1/0,rate:e.rate}]}});