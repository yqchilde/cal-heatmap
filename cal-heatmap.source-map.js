{"version":3,"file":"cal-heatmap.min.js","sources":["cal-heatmap.js"],"names":["mergeRecursive","obj1","obj2","p","constructor","Object","e","CalHeatMap","_init","self","_domains","getDomain","options","start","map","d","getTime","root","d3","select","itemSelector","append","attr","paintOnLoad","paint","nextSelector","on","itemNamespace","event","preventDefault","loadNextDomain","previousSelector","loadPreviousDomain","displayLegend","graphDim","width","domainGutter","cellPadding","afterLoad","loadOnInit","getDatas","data","Date","getSubDomain","length","pop","fill","svg","onComplete","this","allowedDataType","range","cellSize","cellRadius","domainMargin","domain","subDomain","weekStartOnMonday","minDate","maxDate","dataType","considerMissingDataAsZero","verticalOrientation","domainDynamicDimension","label","position","align","offset","x","y","rotate","legend","legendCellSize","legendCellPadding","legendMargin","legendVerticalPosition","legendHorizontalPosition","highlight","itemName","domainLabelFormat","subDomainTitleFormat","empty","filled","subDomainDateFormat","subDomainTextFormat","legendTitleFormat","lower","inner","upper","animationDuration","onClick","afterLoadNextDomain","afterLoadPreviousDomain","afterLoadData","onMaxDomainReached","onMinDomainReached","_domainType","min","name","level","row","column","Math","floor","getMinutes","format","date","connector","extractUnit","hour","getEndOfMonth","getDate","getHours","getWeekDay","formatHour","time","getFullYear","getDayOfYear","day","getWeekNumber","getMonth","week","month","year","type","x_day","_completed","height","NAVIGATE_LEFT","NAVIGATE_RIGHT","_maxDomainReached","_minDomainReached","domainPosition","DomainPosition","navigationDir","getDomainPosition","index","axis","domainDim","tmp","pushPosition","enteringDomainDim","exitingDomainDim","getPosition","shiftRight","getLast","unshiftPosition","shiftLeft","radius","selection","domainRotate","s","w","domainHorizontalLabelWidth","verticalDomainLabel","domainVerticalLabelHeight","max","outer","h","domainSvg","selectAll","enter","i","classname","getDay","subDomainSvgGroup","rect","getHighlightClassName","positionSubDomainX","positionSubDomainY","call","text","formatDate","transition","duration","tempWidth","tempHeight","exit","remove","init","settings","validateSelector","selector","Element","hasOwnProperty","substring","console","log","indexOf","Array","isArray","splice","k","push","prototype","itemNb","shift","reached","formatNumber","f","nextDomainStartTimestamp","getNextDomain","maxDomainIsReached","parent","minDomainIsReached","previousDomainStartTimestamp","getPreviousDomain","unshift","datetimestamp","insert","legendWidth","legendItem","delay","down","up","display","each","domainUnit","subDomainUnit","htmlClass","value","count","dateIsEqual","isNow","date_a","date_b","getWeekDomain","weekStart","setDate","endDate","stop","mondays","sundays","getYearDomain","years","getMinuteDomain","minutes","getHourDomain","hours","getDayDomain","parseInt","days","getMonthDomain","setMonth","months","computeDaySubDomainSize","lastDayOfMonth","computeMinSubDomainSize","computeHourSubDomainSize","endOfMonth","computeWeekSubDomainSize","endWeekNb","startWeekNb","n","isNaN","total","datas","response","parseDatas","source","startDate","callback","json","parseURI","csv","tsv","stats","str","replace","toISOString","next","previous","getSVG","styles",".graph",".graph-rect","rect.highlight","rect.now","text.highlight","text.now",".domain-background",".graph-label",".subdomain-text",".qi","j","whitelistStyles","filterStyles","attribute","property","getElement","element","dom","window","cs","getComputedStyle","item","getPropertyValue","css","currentStyle","string","style","l","XMLSerializer","serializeToString","positions","dim","String","formatted","prop","arguments","regexp","RegExp","define","amd"],"mappings":"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"}