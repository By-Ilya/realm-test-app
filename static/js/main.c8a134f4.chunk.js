(this["webpackJsonprealm-test-app"]=this["webpackJsonprealm-test-app"]||[]).push([[0],{196:function(e,t){e.exports={getThisMonth:function(e){var t=new Date(e.getFullYear(),e.getMonth(),1);return t.setUTCHours(0,0,0,0),t},getNextMonth:function(e){var t,a=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];t=11===e.getMonth()?new Date(e.getFullYear()+1,0,1):new Date(e.getFullYear(),e.getMonth()+1,1);a?t.setUTCHours(0,0,0,0):t.setHours(0,0,0,0);return t}}},246:function(e,t){e.exports={toEnUsDate:function(e){return new Date(e).toLocaleString("en-US")},toDateOnly:function(e){return function(e){var t=new Date(e),a=""+(t.getUTCMonth()+1),n=""+t.getUTCDate(),r=t.getUTCFullYear();a.length<2&&(a="0"+a);n.length<2&&(n="0"+n);return[a,n,r].join("-")}(new Date(e))}}},253:function(e,t){function a(e){for(var t=(new Date).getMonth(),a=t<1?1:t<4?4:t<7?7:t<10?10:1,n=a>t?a-t:t+12-a,r=0,o=0;o<n;o++)r+=e[o];return r}e.exports={convertForecastIntoRows:function(e){var t=a([e.most_likely[0],e.most_likely[1],e.most_likely[2]])+e.delivered_qtd,n=a([e.expiring[0],e.expiring[1],e.expiring[2]])+e.expired_qtd,r=t+n,o=a([e.risk[0],e.risk[1],e.risk[2]]),c=a([e.upside[0],e.upside[1],e.upside[2]]),l=[];return l.push({name:"Delivered",0:e.delivered_qtd,cq_field:"Delivered QTD",cq_call:e.delivered_qtd}),l.push({name:"Expired",0:e.expired_qtd,cq_field:"Expired QTD",cq_call:e.expired_qtd}),l.push({name:"Scheduled",0:e.scheduled[0],1:e.scheduled[1],2:e.scheduled[2],cq_field:"Delivered Call",cq_call:t}),l.push({name:"Expiring",0:e.expiring[0],1:e.expiring[1],2:e.expiring[2],cq_field:"Expired Call",cq_call:n}),l.push({name:"Most Likely $",0:e.most_likely[0],1:e.most_likely[1],2:e.most_likely[2],cq_field:"All-in Call",cq_call:r}),l.push({name:"Risk $",0:e.risk[0],1:e.risk[1],2:e.risk[2],cq_field:"ROQ Risk",cq_call:o}),l.push({name:"Upside $",0:e.upside[0],1:e.upside[1],2:e.upside[2],cq_field:"ROQ Upside",cq_call:c}),l},getCallFromThree:a}},388:function(e,t){function a(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}a.keys=function(){return[]},a.resolve=a,e.exports=a,a.id=388},440:function(e,t,a){e.exports=a(521)},445:function(e,t,a){},520:function(e,t,a){},521:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(22),c=a.n(o);a(445),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var l=a(35),i=a(38),s=a(112),u=a(113),m=a(16),p=a(10),f=a.n(p),d=a(20),b=a(231),g=a(262),h=r.a.createContext("realm");a(450).config();var v="".concat("557365268660-ss6m5j9pf6nlmbojiitp36avqcf1pov6.apps.googleusercontent.com")||!1,j="".concat("Realm")||!1,E="".concat("https://realm.io/")||!1,O="".concat("realm-test-app-nmyei")||!1,w="".concat("mongodb-atlas")||!1,C="".concat("shf")||!1,x="".concat("psproject")||!1,y="".concat("https://by-ilya.github.io/realm-test-app/google-callback")||!1,k=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).setUser=function(e){if(n.setState({user:e}),n.state.app&&e){n.setFilter({active_user_filter:e.profile.email});var t=e.mongoClient(w).db(C).collection(x);n.setState({dbCollection:t});var a=e.mongoClient(w).db(C).collection("");n.setState({fcstCollection:a})}},n.googleHandleRedirect=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:g.c();case 1:case"end":return e.stop()}}),e)}))),n.googleSignIn=Object(d.a)(f.a.mark((function e(){var t,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=g.b.google(y),e.prev=1,e.next=4,n.state.app.logIn(t);case 4:a=e.sent,n.setUser(a),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),console.error(e.t0);case 11:case"end":return e.stop()}}),e,null,[[1,8]])}))),n.getUserAccessToken=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.state.app.currentUser.refreshCustomData();case 2:return e.abrupt("return",n.state.app.currentUser.accessToken);case 3:case"end":return e.stop()}}),e)}))),n.fetchFiltersDefaultValues=Object(d.a)(f.a.mark((function e(){var t;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.state.user){e.next=5;break}return e.next=3,n.state.user.functions.getFiltersDefaultValues();case 3:t=e.sent,n.setState({regionsList:t.regions.sort()||[],ownersList:t.owners.sort()||[],projectManagersList:t.projectManagers.sort()||[]});case 5:case"end":return e.stop()}}),e)}))),n.setLoadProcessing=function(e){n.setState({loadProcessing:e})},n.setProjects=function(e){n.setState({projects:e})},n.cleanLocalProjects=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n.setState({projects:[],projectWithCurrentMilestone:null});case 1:case"end":return e.stop()}}),e)}))),n.logOut=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.state.app.currentUser.logOut();case 2:n.setUser(n.state.app.currentUser);case 3:case"end":return e.stop()}}),e)}))),n.setFilter=function(e){var t=Object(m.a)(Object(m.a)({},n.state.filter),e);n.setState({filter:t})},n.setSorting=function(e){n.setState({sort:e})},n.setProjectWithCurrentMilestone=function(e){n.setState({projectWithCurrentMilestone:e})},n.setIsEditing=function(e){n.setState({isEditing:e})},n.watcher=Object(d.a)(f.a.mark((function e(){var t,a,r,o,c,l,i;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.state.dbCollection){e.next=2;break}return e.abrupt("return");case 2:if(n.state.user&&n.state.app.currentUser.isLoggedIn){e.next=4;break}return e.abrupt("return");case 4:t=!0,a=!1,e.prev=6,o=function(){var e=i,t=e.clusterTime,a=e.operationType,r=e.fullDocument;if((!n.lastUpdateTime||n.lastUpdateTime<t)&&r){n.lastUpdateTime=t;var o=n.state.projects;if("replace"===a||"update"===a){var c=e.fullDocument._id;o=o.map((function(t){return t._id===c?e.fullDocument:t}))}else"insert"===a&&o.push(e.fullDocument);n.setState({projects:o})}},c=Object(b.a)(n.state.dbCollection.watch());case 9:return e.next=11,c.next();case 11:return l=e.sent,t=l.done,e.next=15,l.value;case 15:if(i=e.sent,t){e.next=21;break}o();case 18:t=!0,e.next=9;break;case 21:e.next=27;break;case 23:e.prev=23,e.t0=e.catch(6),a=!0,r=e.t0;case 27:if(e.prev=27,e.prev=28,t||null==c.return){e.next=32;break}return e.next=32,c.return();case 32:if(e.prev=32,!a){e.next=35;break}throw r;case 35:return e.finish(32);case 36:return e.finish(27);case 37:case"end":return e.stop()}}),e,null,[[6,23,27,37],[28,,32,36]])}))),n.getActiveUserName=function(){return n.state.user.profile.email},n.state=Object(m.a)(Object(m.a)({},n.state),{},{googleClientId:v,realmAppId:O,appName:j,copyrightLink:E,app:new g.a(O),user:null,dbCollection:null,fcstCollection:null,filter:{region:"",owner:"",project_manager:"",name:"",active:!0,active_user_filter:""},sort:{field:"name",order:"ASC"},regionsList:[],ownersList:[],projectManagersList:[],loadProcessing:!1,projects:null,projectWithCurrentMilestone:null,isEditing:!1}),n.funcs={setUser:n.setUser,googleSignIn:n.googleSignIn,googleHandleRedirect:n.googleHandleRedirect,getUserAccessToken:n.getUserAccessToken,logOut:n.logOut,fetchFiltersDefaultValues:n.fetchFiltersDefaultValues,setLoadProcessing:n.setLoadProcessing,setProjects:n.setProjects,cleanLocalProjects:n.cleanLocalProjects,setFilter:n.setFilter,setSorting:n.setSorting,setProjectWithCurrentMilestone:n.setProjectWithCurrentMilestone,setIsEditing:n.setIsEditing,watcher:n.watcher,getActiveUserName:n.getActiveUserName},n.lastUpdateTime=null,n}return Object(i.a)(a,[{key:"render",value:function(){return r.a.createElement(h.Provider,{value:Object(m.a)(Object(m.a)({},this.state),this.funcs)},this.props.children)}}]),a}(r.a.Component),_=a(431),M=a(42),N=a(559),S=a(541),D=a(542),T=a(289),I=a(411),R=a.n(I),P=a(104),U=a(362),F=a(540),L=a(410),B=a.n(L),V=Object(U.a)((function(e){return{paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},submit:{margin:e.spacing(3,0,2)},signInForm:{width:"100%",marginTop:e.spacing(3),marginBottom:e.spacing(1),display:"flex",justifyContent:"center"},errorBox:{width:"100%",marginTop:e.spacing(1),display:"flex",justifyContent:"center"}}}));function A(e){var t=e.appName,a=e.copyrightLink,n=e.googleSignIn,o=e.signInError,c=V();return r.a.createElement(F.a,{component:"main",maxWidth:"xs"},r.a.createElement(S.a,null),r.a.createElement("div",{className:c.paper},r.a.createElement(N.a,{className:c.avatar},r.a.createElement(R.a,null)),r.a.createElement(P.a,{component:"h1",variant:"h5"},"Sign in"),r.a.createElement("div",{className:c.signInForm},r.a.createElement(B.a,{type:"light",onClick:n})),o&&r.a.createElement("div",{className:c.errorBox},r.a.createElement(P.a,{variant:"body2",color:"error",align:"center"},o))),r.a.createElement(T.a,{mt:1},r.a.createElement(q,{appName:t,copyrightLink:a})))}function q(e){var t=e.appName,a=e.copyrightLink;return r.a.createElement(P.a,{variant:"body2",color:"textSecondary",align:"center"},"Copyright \xa9 ",r.a.createElement(D.a,{color:"inherit",href:a},t)," ",(new Date).getFullYear(),".")}A.defaultProps={signInError:null};var W=a(37),H=a(135),K=a(39),Y=a(15),z=a(548),$=a(364),Q=a(299),G=a(365),J=a(225),X=a(241),Z=a.n(X),ee=a(434);function te(e){var t=e.classes,a=e.inputPlaceHolder,n=e.onKeyDown,o=t.searchContainer,c=t.searchIcon,l=t.inputBaseRoot,i=t.inputBaseInput;return r.a.createElement("div",{className:o},r.a.createElement("div",{className:c},r.a.createElement(Z.a,null)),r.a.createElement(ee.a,{placeholder:a,classes:{root:l,input:i},inputProps:{"aria-label":"search"},onKeyDown:n}))}var ae=a(363),ne=a(543),re=a(545),oe=a(546),ce=a(547),le=a(297),ie=a(298),se=a(303),ue=a(243);function me(e){var t=e.classes,a=e.filterButtonText,o=e.filterDialogTitle,c=e.filtersObject,l=e.applyButtonText,i=e.onApplyFilters,s=e.showEmptyValue,u=t.formContainer,m=Object(n.useState)(!1),p=Object(W.a)(m,2),f=p[0],d=p[1],b=function(){d(!1)};return r.a.createElement("div",{className:u},r.a.createElement(ae.a,{onClick:function(){d(!0)},variant:"contained"},a),r.a.createElement(ne.a,{disableBackdropClick:!0,disableEscapeKeyDown:!0,open:f,onClose:b},r.a.createElement(re.a,null,o),r.a.createElement(oe.a,null,r.a.createElement("form",{className:u},c.map((function(e){return r.a.createElement(pe,{classes:{formControl:t.formControl},label:e.label,currentValue:e.currentValue,values:e.values,setValue:e.setValue,showEmptyValue:s})})))),r.a.createElement(ce.a,null,r.a.createElement(ae.a,{onClick:b,color:"primary"},"Cancel"),r.a.createElement(ae.a,{onClick:function(){i(),d(!1)},color:"primary"},l))))}function pe(e){var t=e.classes,a=e.label,n=e.currentValue,o=e.values,c=e.setValue,l=e.showEmptyValue,i=t.formControl;return r.a.createElement(le.a,{className:i},r.a.createElement(ie.a,{htmlFor:"demo-dialog-native"},a),r.a.createElement(se.a,{native:!0,value:n,onChange:c,input:r.a.createElement(ue.a,{id:"demo-dialog-native"})},l&&r.a.createElement("option",{value:""}),o.map((function(e){return r.a.createElement("option",{value:e},e)}))))}var fe=a(414),de=a.n(fe),be=a(413),ge=a.n(be),he=Object(U.a)((function(e){return{img:{width:"35px",height:"35px",borderRadius:"50%",objectFit:"cover"},textBlock:{display:"block",marginLeft:"0.5rem",textAlign:"left",overflow:"hidden",textOverflow:"ellipsis"},name:{fontSize:"14px",fontWeight:"600"},email:{fontSize:"11px",fontWeight:"500"}}}));function ve(e){var t=he(),a=e.avatarImage,n=e.accountName,o=e.accountEmail;return r.a.createElement(r.a.Fragment,null,a?r.a.createElement("img",{src:a,className:t.img}):r.a.createElement(ge.a,null),r.a.createElement("div",{className:t.textBlock},r.a.createElement("div",{className:t.name},n||"Anonymous"),r.a.createElement("div",{className:t.email},o||"anonymous")))}function je(e){var t=e.classes,a=e.profile,n=e.menuId,o=e.mobileMenuId,c=e.onProfileMenuOpen,l=e.onMobileMenuOpen,i=t.sectionDesktop,s=t.sectionMobile,u=a.email,m=a.name,p=a.pictureUrl;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:i},r.a.createElement(Q.a,{edge:"end","aria-label":"account of current user","aria-controls":n,"aria-haspopup":"true",onClick:c,color:"inherit"},r.a.createElement(ve,{avatarImage:p,accountName:m,accountEmail:u}))),r.a.createElement("div",{className:s},r.a.createElement(Q.a,{"aria-label":"show more","aria-controls":o,"aria-haspopup":"true",onClick:l,color:"inherit"},r.a.createElement(de.a,null))))}var Ee=Object(U.a)((function(e){return{grow:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:Object(K.a)({display:"none"},e.breakpoints.up("sm"),{display:"block"}),search:Object(K.a)({position:"relative",borderRadius:e.shape.borderRadius,backgroundColor:Object(Y.d)(e.palette.common.white,.15),"&:hover":{backgroundColor:Object(Y.d)(e.palette.common.white,.25)},marginRight:e.spacing(2),marginLeft:0,width:"100%"},e.breakpoints.up("sm"),{marginLeft:e.spacing(3),width:"auto"}),searchIcon:{padding:e.spacing(0,2),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"},inputRoot:{color:"inherit"},inputInput:Object(K.a)({padding:e.spacing(1,1,1,0),paddingLeft:"calc(1em + ".concat(e.spacing(4),"px)"),transition:e.transitions.create("width"),width:"100%"},e.breakpoints.up("md"),{width:"20ch"}),formContainer:{marginLeft:e.spacing(2)},formControl:{margin:e.spacing(1),minWidth:120},sectionDesktop:Object(K.a)({display:"none"},e.breakpoints.up("md"),{display:"flex"}),sectionMobile:Object(K.a)({display:"flex"},e.breakpoints.up("md"),{display:"none"})}}));function Oe(e){var t=Ee(),a=e.fetchProjects,o=Object(n.useContext)(h),c=o.filter,l=o.setFilter,i=o.sort,s=o.setSorting,u=o.regionsList,p=o.ownersList,b=o.projectManagersList,g=o.fetchFiltersDefaultValues,v=o.setLoadProcessing,j=o.getActiveUserName,E=o.user,O=o.logOut;Object(n.useEffect)((function(){g()}),[]),Object(n.useEffect)((function(){v(!0),a({needToClean:!0})}),[c,i]);var w=E.profile,C=Object(n.useState)(c),x=Object(W.a)(C,2),y=x[0],k=x[1],_=[{label:"Region",currentValue:y.region,values:u,setValue:function(e){k(Object(m.a)(Object(m.a)({},y),{},{region:e.target.value}))}},{label:"Owner",currentValue:y.owner,values:p,setValue:function(e){k(Object(m.a)(Object(m.a)({},y),{},{owner:e.target.value}))}},{label:"PM",currentValue:y.project_manager,values:b,setValue:function(e){k(Object(m.a)(Object(m.a)({},y),{},{project_manager:e.target.value}))}},{label:"Only Active",currentValue:y.active?"Yes":"No",values:["Yes","No"],setValue:function(e){k(Object(m.a)(Object(m.a)({},y),{},{active:"Yes"===e.target.value}))}},{label:"Only my projects",currentValue:y.active_user_filter?"Yes":"No",values:["Yes","No"],setValue:function(e){k(Object(m.a)(Object(m.a)({},y),{},{active_user_filter:"Yes"===e.target.value?j():""}))}}],M=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;void 0!==e?(k(Object(m.a)(Object(m.a)({},y),{},{name:e})),l(Object(m.a)(Object(m.a)({},y),{},{name:e}))):l(y)},N=Object(n.useState)(i),S=Object(W.a)(N,2),D=S[0],T=S[1],I=[{label:"Field",currentValue:D.field,values:["name","region","owner"],setValue:function(e){T(Object(m.a)(Object(m.a)({},D),{},{field:e.target.value}))}},{label:"Order",currentValue:D.order,values:["ASC","DESC"],setValue:function(e){T(Object(m.a)(Object(m.a)({},D),{},{order:e.target.value}))}}],R=function(){var e=Object(d.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:"Enter"===t.key&&M(t.target.value);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),U="primary-search-account-menu",F=r.a.useState(null),L=Object(W.a)(F,2),B=L[0],V=L[1],A=r.a.useState(null),q=Object(W.a)(A,2),H=q[0],K=q[1],Y=Boolean(B),Q=Boolean(H),G=function(e){V(e.currentTarget)},J=function(){K(null)},X=function(){V(null),J()};return r.a.createElement("div",{className:t.grow},r.a.createElement(z.a,{position:"fixed"},r.a.createElement($.a,null,r.a.createElement(P.a,{className:t.title,variant:"h6",noWrap:!0},"Projects"),r.a.createElement(te,{classes:{searchContainer:t.search,searchIcon:t.searchIcon,inputBaseRoot:t.inputRoot,inputBaseInput:t.inputInput},inputPlaceHolder:"Search projects",onKeyDown:R}),r.a.createElement(me,{classes:{formContainer:t.formContainer,formControl:t.formControl},filterButtonText:"Filters",filterDialogTitle:"Filter projects",filtersObject:_,applyButtonText:"Apply filters",onApplyFilters:M,showEmptyValue:!0}),r.a.createElement(me,{classes:{formContainer:t.formContainer,formControl:t.formControl},filterButtonText:"Sort",filterDialogTitle:"Sort projects",filtersObject:I,applyButtonText:"Sort",onApplyFilters:function(){s(D)},showEmptyValue:!1}),r.a.createElement("div",{className:t.grow}),r.a.createElement(je,{classes:{sectionDesktop:t.sectionDesktop,sectionMobile:t.sectionMobile},profile:w,menuId:U,mobileMenuId:"primary-search-account-menu-mobile",onProfileMenuOpen:G,onMobileMenuOpen:function(e){K(e.currentTarget)}}))),r.a.createElement(Ce,{mobileMoreAnchorEl:H,mobileMenuId:"primary-search-account-menu-mobile",isMobileMenuOpen:Q,onMobileMenuClose:J,onProfileMenuOpen:G,profile:w}),r.a.createElement(we,{anchorEl:B,menuId:U,isMenuOpen:Y,onMenuClose:X,onLogOut:function(){O(),X()}}))}function we(e){var t=e.anchorEl,a=e.menuId,n=e.isMenuOpen,o=e.onMenuClose,c=e.onLogOut;return r.a.createElement(J.a,{anchorEl:t,anchorOrigin:{vertical:"top",horizontal:"right"},id:a,keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:n,onClose:o},r.a.createElement(G.a,{onClick:c},"Log Out"))}function Ce(e){var t=e.mobileMoreAnchorEl,a=e.mobileMenuId,n=e.isMobileMenuOpen,o=e.onMobileMenuClose,c=e.onProfileMenuOpen,l=e.profile,i=l.name,s=l.email,u=l.pictureUrl;return r.a.createElement(J.a,{anchorEl:t,anchorOrigin:{vertical:"top",horizontal:"right"},id:a,keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:n,onClose:o},r.a.createElement(G.a,{onClick:c},r.a.createElement(Q.a,{"aria-label":"account of current user","aria-controls":"primary-search-account-menu","aria-haspopup":"true",color:"inherit"},r.a.createElement(ve,{avatarImage:u,accountName:i,accountEmail:s}))))}var xe=a(532),ye=a(552),ke=a(533),_e=a(367),Me=a(549),Ne=a(550),Se=a(551),De=a(366),Te=a(246),Ie=Object(U.a)({root:{width:"55vh",marginBottom:5},info:{display:"inline-block",width:"100%"},leftInfo:{float:"left"},rightInfo:{float:"right"},title:{fontSize:14},pos:{marginBottom:12}});function Re(e){var t=Ie(),a=e.psproject,o=Object(n.useContext)(h),c=o.user,l=o.setProjectWithCurrentMilestone,i=function(){var e=Object(d.a)(f.a.mark((function e(t){var n,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c.functions.getMilestoneScheduleOnwards(t._id);case 2:return n=e.sent,e.next=5,c.functions.getMilestoneForecast(t._id);case 5:r=e.sent,l({project:a,milestone:Object(m.a)(Object(m.a)({},t),{},{schedule:n}),forecast:r});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement(Me.a,{className:t.root},r.a.createElement(Ne.a,null,r.a.createElement("div",{className:t.info},r.a.createElement("div",{className:t.leftInfo},r.a.createElement(P.a,{className:t.title,color:"textSecondary",gutterBottom:!0},a.account)),r.a.createElement("div",{className:t.rightInfo},r.a.createElement(P.a,{className:t.title,color:"textSecondary",gutterBottom:!0},a.region))),r.a.createElement(P.a,{variant:"h5",component:"h2"},a.name),r.a.createElement("div",{className:t.info},r.a.createElement("div",{className:t.leftInfo},r.a.createElement(P.a,{className:t.pos,color:"textSecondary",gutterBottom:!0},"Owner: ",a.owner)),r.a.createElement("div",{className:t.rightInfo},r.a.createElement(P.a,{className:t.pos,color:"textSecondary",gutterBottom:!0},"PM: ",a.project_manager))),r.a.createElement(P.a,{variant:"body2",component:"p"},r.a.createElement("b",null,"Stage:")," ",a.details.pm_stage),r.a.createElement(P.a,{variant:"body2",component:"p"},r.a.createElement("b",null,"Status:")," ",a.details.pm_project_status),r.a.createElement(P.a,{variant:"body2",component:"p"},r.a.createElement("b",null,"Expires:")," ",Object(Te.toDateOnly)(a.details.product_end_date)),r.a.createElement(Se.a,null),r.a.createElement(Pe,{milestones:a.milestones,onClickMilestone:i})))}function Pe(e){var t=e.milestones,a=e.onClickMilestone;return r.a.createElement(xe.a,{subheader:r.a.createElement("li",null)},r.a.createElement(ye.a,null,"Milestones"),t&&t.map((function(e){return r.a.createElement(ke.a,{button:!0,onClick:function(){return a(e)},key:e._id},r.a.createElement(De.a,{primary:e.name}))})))}function Ue(e){var t=e.classes,a=Object(n.useContext)(h),o=a.loadProcessing,c=a.projects;return r.a.createElement(xe.a,{component:"nav",className:t.listRoot,"aria-label":"contacts"},r.a.createElement(ye.a,{color:"primary"},r.a.createElement(P.a,{variant:"h5"},"Total projects: ",c?c.length:0)),o&&r.a.createElement(ke.a,null,r.a.createElement(_e.a,null)),!o&&c&&c.map((function(e){return r.a.createElement(ke.a,{key:e._id},r.a.createElement(Re,{psproject:e}))})))}var Fe=a(557),Le=a(156),Be=a(94),Ve=a(186),Ae=a.n(Ve),qe=a(417),We=a.n(qe),He=a(426),Ke=a.n(He),Ye=a(418),ze=a.n(Ye),$e=a(425),Qe=a.n($e),Ge=a(306),Je=a.n(Ge),Xe=a(305),Ze=a.n(Xe),et=a(419),tt=a.n(et),at=a(420),nt=a.n(at),rt=a(422),ot=a.n(rt),ct=a(423),lt=a.n(ct),it=a(424),st=a.n(it),ut=a(427),mt=a.n(ut),pt=a(421),ft=a.n(pt),dt=a(428),bt=a.n(dt);function gt(e){var t=e.onClickEditButton;return{Add:Object(n.forwardRef)((function(e,t){return r.a.createElement(We.a,Object.assign({},e,{ref:t}))})),Check:Object(n.forwardRef)((function(e,t){return r.a.createElement(ze.a,Object.assign({},e,{ref:t}))})),Clear:Object(n.forwardRef)((function(e,t){return r.a.createElement(Ze.a,Object.assign({},e,{ref:t}))})),Delete:Object(n.forwardRef)((function(e,t){return r.a.createElement(tt.a,Object.assign({},e,{ref:t}))})),DetailPanel:Object(n.forwardRef)((function(e,t){return r.a.createElement(Je.a,Object.assign({},e,{ref:t}))})),Edit:Object(n.forwardRef)((function(e,a){return r.a.createElement(nt.a,Object.assign({},e,{ref:a,onClick:t}))})),Export:Object(n.forwardRef)((function(e,t){return r.a.createElement(ft.a,Object.assign({},e,{ref:t}))})),Filter:Object(n.forwardRef)((function(e,t){return r.a.createElement(ot.a,Object.assign({},e,{ref:t}))})),FirstPage:Object(n.forwardRef)((function(e,t){return r.a.createElement(lt.a,Object.assign({},e,{ref:t}))})),LastPage:Object(n.forwardRef)((function(e,t){return r.a.createElement(st.a,Object.assign({},e,{ref:t}))})),NextPage:Object(n.forwardRef)((function(e,t){return r.a.createElement(Je.a,Object.assign({},e,{ref:t}))})),PreviousPage:Object(n.forwardRef)((function(e,t){return r.a.createElement(Qe.a,Object.assign({},e,{ref:t}))})),ResetSearch:Object(n.forwardRef)((function(e,t){return r.a.createElement(Ze.a,Object.assign({},e,{ref:t}))})),Search:Object(n.forwardRef)((function(e,t){return r.a.createElement(Z.a,Object.assign({},e,{ref:t}))})),SortArrow:Object(n.forwardRef)((function(e,t){return r.a.createElement(Ke.a,Object.assign({},e,{ref:t}))})),ThirdStateCheck:Object(n.forwardRef)((function(e,t){return r.a.createElement(mt.a,Object.assign({},e,{ref:t}))})),ViewColumn:Object(n.forwardRef)((function(e,t){return r.a.createElement(bt.a,Object.assign({},e,{ref:t}))}))}}function ht(e){var t=e.projectId,a=e.tableName,o=e.currentColumns,c=e.currentData,l=e.onUpdate,i=Object(n.useContext)(h),s=i.isEditing,u=i.setIsEditing,m=Object(n.useState)(o),p=Object(W.a)(m,2),b=p[0],g=p[1],v=Object(n.useState)(c),j=Object(W.a)(v,2),E=j[0],O=j[1];Object(n.useEffect)((function(){!s&&g(o)}),[s,t,o]),Object(n.useEffect)((function(){!s&&O(c)}),[s,t,c]);return r.a.createElement(Ae.a,{title:a,icons:gt({onClickEditButton:function(){return u(!0)}}),columns:b,data:E,editable:{isEditable:function(e){return e.editable},onRowUpdate:function(){var e=Object(d.a)(f.a.mark((function e(t,a){var n,r,o,c;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.tableKey,r=t.updateKey,e.next=4,l({updateKey:r,value:t[n]});case 4:o=Object(Be.a)(E),c=a.tableData.id,o[c]=t,O(Object(Be.a)(o)),u(!1),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),console.error(e.t0),u(!1);case 15:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(t,a){return e.apply(this,arguments)}}(),onRowUpdateCancelled:function(){return u(!1)}}})}var vt=a(196),jt=a(253);function Et(e){var t=e.projectId,a=e.tableName,o=e.currentColumns,c=e.currentData,l=e.onUpdate,i=Object(n.useContext)(h),s=i.isEditing,u=i.setIsEditing,m=Object(n.useState)(o),p=Object(W.a)(m,2),f=p[0],d=p[1],b=Object(n.useState)(c),g=Object(W.a)(b,2),v=g[0],j=g[1];Object(n.useEffect)((function(){!s&&d(o)}),[s,t,o]),Object(n.useEffect)((function(){!s&&j(c)}),[s,t,c]);return r.a.createElement(Ae.a,{title:a,icons:gt({onClickEditButton:function(){return u(!0)}}),columns:f,data:v,options:{search:!1,sorting:!1,paging:!1},cellEditable:{isCellEditable:function(e,t){return e.tableData.id>4&&t.tableData.columnOrder>=1&&t.tableData.columnOrder<=3},onCellEditStarted:function(e,t){},onCellEditApproved:function(e,t,a,n){var r,o;switch(n.tableData.columnOrder){case 1:r=Object(vt.getThisMonth)(new Date);break;case 2:r=Object(vt.getNextMonth)(new Date);break;case 3:r=Object(vt.getNextMonth)(Object(vt.getNextMonth)(new Date,!1));break;default:r=null}switch(a.tableData.id){case 5:o="risk";break;case 6:o="upside";break;default:o=null}if(!r||!o)return Promise.reject();var c=Object(Be.a)(v),i=a.tableData.id,s=n.field;return c[i][s]=parseFloat(e),c[i].cq_call=Object(jt.getCallFromThree)([c[i][0],c[i][1],c[i][2]]),j(Object(Be.a)(c)),l({month:r,updateKey:o,value:parseFloat(e)})}}})}function Ot(e){var t=e.classes,a=e.project,o=Object(n.useContext)(h),c=o.dbCollection,l=o.fcstCollection,i=function(e){if(!e)return{milestonesTableColumns:[],milestonesTableRows:[]};var t=e.owner,a=e.region,n=e.project_manager,r=e.account,o=e.name,c=e.opportunity,l=e.details,i=e.currentMilestone;return{milestonesTableColumns:[{title:"Project / Milestone Fields",field:"name",editable:"never"},{title:"Value",field:"value",editable:"onUpdate"}],milestonesTableRows:[{name:"Project Owner",value:t,editable:!1},{name:"Region",value:a,editable:!1},{name:"Project Manager",value:n,editable:!1},{name:"PM Stage",value:l.pm_stage,editable:!0,tableKey:"value",updateKey:"details.pm_stage"},{name:"Account",value:r,editable:!1},{name:"Opportunity",value:c.name,editable:!1},{name:"PS Project Name",value:o,editable:!1},{name:"Milestone Name",value:i.name,editable:!1},{name:"Country",value:i.country,editable:!1},{name:"Milestone amount",value:i.details.milestone_amount,editable:!1},{name:"Gap Hours",value:i.summary.gap_hours,editable:!1}]}}(a),s=i.milestonesTableColumns,u=i.milestonesTableRows,m=function(e){return e?{scheduleTableColumns:[{title:"Date",field:"date",editable:"never"},{title:"Scheduled",field:"scheduled",editable:"never"},{title:"Hours",field:"hours",editable:"never"}],scheduleTableRows:e.currentMilestone.schedule.map((function(e){return{date:Object(Te.toDateOnly)(e.week),scheduled:e.revenue?"$ ".concat(e.revenue.toFixed(0)):"-",hours:e.hours?e.hours:"-",editable:!1}}))}:{scheduleTableColumns:[],scheduleTableRows:[]}}(a),p=m.scheduleTableColumns,b=m.scheduleTableRows,g=function(e){if(!e)return{forecastTableColumns:[],forecastTableRows:[]};e.currentMilestone;var t=e.forecast;return{forecastTableColumns:[{title:"N3M",field:"name"},{title:"Month + 0",field:"0"},{title:"Month + 1",field:"1"},{title:"Month + 2",field:"2"},{title:"Current Quarter",field:"cq_field"},{title:"Quarter Call",field:"cq_call"}],forecastTableRows:Object(jt.convertForecastIntoRows)(t)}}(a),v=g.forecastTableColumns,j=g.forecastTableRows,E=function(){var e=Object(d.a)(f.a.mark((function e(t){var n,r,o,l,i;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.updateKey,r=t.value,o={_id:a._id},l={$set:Object(K.a)({},n,r)},i={upsert:!1},e.next=6,c.updateOne(o,l,i);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),O=function(){var e=Object(d.a)(f.a.mark((function e(t){var n,r,o,c,i,s;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.month,r=t.updateKey,o=t.value,c={milestoneId:a.currentMilestone._id,month:n},i={$set:Object(K.a)({},r,o)},s={upsert:!0},e.next=6,l.updateOne(c,i,s);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement(r.a.Fragment,null,0!==u.length&&r.a.createElement("div",{className:t.tableContainer},r.a.createElement(ht,{projectId:a._id,tableName:"Project milestone info",currentColumns:s,currentData:u,onUpdate:E})),0!==b.length&&r.a.createElement("div",{className:t.tableContainer},r.a.createElement(ht,{projectId:a._id,tableName:"Schedule",currentColumns:p,currentData:b})),0!==j.length&&r.a.createElement("div",{className:t.tableContainer},r.a.createElement(Et,{projectId:a._id,milestoneId:a.currentMilestone._id,tableName:"Forecast",currentColumns:v,currentData:j,onUpdate:O})))}var wt=Object(U.a)({tableContainer:{marginTop:"20px"}});function Ct(e){var t=wt(),a=e.classes,o=Object(n.useContext)(h),c=o.projectWithCurrentMilestone,l=(o.projects,null),i=null,s=null;return c&&(l=c.project,i=c.milestone,s=c.forecast),r.a.createElement(Fe.a,{container:!0},r.a.createElement(Fe.a,{item:!0,xs:12},r.a.createElement(Le.a,{className:a.paper},r.a.createElement(P.a,{variant:"h4",gutterBottom:!0},"Milestones overview"),r.a.createElement(Se.a,null),l&&i?r.a.createElement(Ot,{classes:t,project:Object(m.a)(Object(m.a)({},l),{},{currentMilestone:i,forecast:s})}):r.a.createElement("div",{className:t.tableContainer},r.a.createElement(P.a,{variant:"body1"},"Click on project milestone to see an overview...")))))}var xt=Object(U.a)((function(e){return{container:{marginTop:70,display:"flex",flexDirection:"row"},root:{width:"90vh",backgroundColor:e.palette.background.paper,position:"relative",overflow:"auto",minHeight:"90vh",height:"90vh"},paper:{padding:e.spacing(1),textAlign:"center",color:e.palette.text.primary,whiteSpace:"normal",marginBottom:e.spacing(1),marginLeft:e.spacing(2),marginRight:e.spacing(1),maxHeight:"90vh",overflow:"auto"}}}));function yt(){var e=xt();return r.a.createElement("div",{className:e.container},r.a.createElement(Ue,{classes:{listRoot:e.root}}),r.a.createElement(Ct,{classes:{paper:e.paper}}))}var kt=a(429),_t=a(125);function Mt(){var e=Object(kt.a)(["\n    query FindProjectsCustomResolver($filtersInput: FiltersInput!) {\n        psprojectsData(input: $filtersInput) {\n            _id\n            account\n            active\n            details {\n                pm_stage\n                pm_project_status\n                product_end_date\n            }\n            opportunity {\n                name\n                owner\n                engagement_manager\n            }\n            milestones {\n                _id\n                country\n                currency\n                name\n                summary {\n                    planned_hours\n                    sold_hours\n                    delivered_hours\n                    gap_hours\n                    unscheduled_hours\n                }\n                details {\n                    first_scheduled_date\n                    last_scheduled_date\n                    bill_rate\n                    milestone_amount\n                    delivered_amount\n                }\n            }\n            name\n            owner\n            project_manager\n            region\n            stage\n        }\n    }\n"]);return Mt=function(){return e},e}var Nt=a.n(_t)()(Mt());function St(){var e=Object(n.useContext)(h),t=e.setProjects,a=e.setLoadProcessing,o=e.cleanLocalProjects,c=e.filter,l=e.sort,i=e.watcher,s={variables:{filtersInput:{filter:Object(m.a)({},c),sort:{field:l.field,order:"DESC"===l.order?-1:1}}}},u=Object(H.useLazyQuery)(Nt,Object(m.a)(Object(m.a)({},s),{},{onCompleted:function(e){t(e.psprojectsData),a(!1)},onError:function(e){console.error(e)},fetchPolicy:"network-only"})),p=Object(W.a)(u,1)[0],b=function(){var e=Object(d.a)(f.a.mark((function e(t){var a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=t.needToClean,e.t0=a,!e.t0){e.next=5;break}return e.next=5,o();case 5:return e.next=7,p();case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),g=setTimeout(function(){var e=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return g&&clearTimeout(g),e.next=3,i();case 3:g=setTimeout(t,5e3);case 4:case"end":return e.stop()}}),e)})));function t(){return e.apply(this,arguments)}return t}(),5e3);return r.a.createElement(r.a.Fragment,null,r.a.createElement(Oe,{fetchProjects:b}),r.a.createElement(yt,null))}function Dt(){var e=Object(n.useContext)(h),t=e.realmAppId,a=e.getUserAccessToken,o=e.user,c=Object(n.useState)(Tt(t,a)),l=Object(W.a)(c,2),i=l[0],s=l[1];return Object(n.useEffect)((function(){s(Tt(t,a))}),[o]),r.a.createElement(H.ApolloProvider,{client:i},r.a.createElement(St,null))}function Tt(e,t){var a="https://realm.mongodb.com/api/client/v2.0/app/".concat(e,"/graphql");return new H.ApolloClient({link:new H.HttpLink({uri:a,fetch:function(e){function t(t,a){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=Object(d.a)(f.a.mark((function e(a,n){var r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:return r=e.sent,n.headers.Authorization="Bearer ".concat(r),e.abrupt("return",fetch(a,n));case 5:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}())}),cache:new H.InMemoryCache})}function It(){var e=Object(n.useContext)(h),t=e.app,a=e.appName,o=e.copyrightLink,c=e.googleSignIn,l=e.googleHandleRedirect,i=e.user,s=e.setUser,u=Object(n.useRef)(t);return Object(n.useEffect)((function(){s(t.currentUser)}),[u.current.currentUser]),r.a.createElement(_.a,null,r.a.createElement(M.c,null,r.a.createElement(M.a,{exact:!0,path:"/realm-test-app/google-callback",render:function(){return r.a.createElement("div",null,"Google Callback ",l())}}),r.a.createElement(M.a,{path:"/*",render:function(){return i?r.a.createElement(Dt,null):r.a.createElement(A,{appName:a,copyrightLink:o,googleSignIn:c})}})))}a(520);var Rt=function(e){Object(s.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(i.a)(a,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(k,null,r.a.createElement(It,null)))}}]),a}(n.Component);c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(Rt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[440,1,2]]]);
//# sourceMappingURL=main.c8a134f4.chunk.js.map