(this["webpackJsonprealm-test-app"]=this["webpackJsonprealm-test-app"]||[]).push([[0],{238:function(e,t){e.exports={toEnUsDate:function(e){return new Date(e).toLocaleString("en-US")}}},377:function(e,t){function n(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id=377},427:function(e,t,n){e.exports=n(505)},432:function(e,t,n){},504:function(e,t,n){},505:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(21),c=n.n(o);n(432),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var l=n(34),i=n(35),s=n(118),u=n(119),m=n(19),p=n(15),f=n.n(p),d=n(22),g=n(253),b=r.a.createContext("realm");n(437).config();var h="".concat("557365268660-ss6m5j9pf6nlmbojiitp36avqcf1pov6.apps.googleusercontent.com")||!1,j="".concat("Realm Test App")||!1,v="".concat("http://By-Ilya.github.io")||!1,E="".concat("realm-test-app-nmyei")||!1,O="".concat("mongodb-atlas")||!1,w="".concat("shf")||!1,C="".concat("psproject")||!1,y=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).setUser=function(e){if(a.setState({user:e}),a.state.app&&e){var t=a.state.app.services.mongodb(O).db(w).collection(C);a.setState({dbCollection:t}),console.log("watch function:",t.watch)}},a.anonymousSignIn=Object(d.a)(f.a.mark((function e(){var t,n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=g.b.anonymous(),e.prev=1,e.next=4,a.state.app.logIn(t);case 4:n=e.sent,a.setUser(n),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),console.error(e.t0);case 11:case"end":return e.stop()}}),e,null,[[1,8]])}))),a.onGoogleSuccessSignIn=function(e){var t=g.b.google(e.code);a.state.app.logIn(t).then((function(e){console.log("Logged in with id: ".concat(e.id)),a.setUser(e)})).catch((function(e){console.error("onGoogleSuccessSignIn:",e)}))},a.onGoogleSignInFailure=function(e){console.error("onGoogleSignInFailure:",e)},a.getUserAccessToken=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.state.app.currentUser.refreshCustomData();case 2:return e.abrupt("return",a.state.app.currentUser.accessToken);case 3:case"end":return e.stop()}}),e)}))),a.fetchFiltersDefaultValues=Object(d.a)(f.a.mark((function e(){var t;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!a.state.user){e.next=5;break}return e.next=3,a.state.user.functions.getFiltersDefaultValues();case 3:t=e.sent,a.setState({regionsList:t.regions.sort()||[],ownersList:t.owners.sort()||[],projectManagersList:t.projectManagers.sort()||[]});case 5:case"end":return e.stop()}}),e)}))),a.setLoadProcessing=function(e){a.setState({loadProcessing:e})},a.setProjects=function(e){a.setState({projects:e})},a.cleanLocalProjects=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.setState({projects:[],projectWithCurrentMilestone:null});case 1:case"end":return e.stop()}}),e)}))),a.logOut=Object(d.a)(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.state.app.currentUser.logOut();case 2:a.setUser(a.state.app.currentUser);case 3:case"end":return e.stop()}}),e)}))),a.setFilter=function(e){var t=Object(m.a)(Object(m.a)({},a.state.filter),e);a.setState({filter:t})},a.setSorting=function(e){a.setState({sort:e})},a.setProjectWithCurrentMilestone=function(e){a.setState({projectWithCurrentMilestone:e})},a.setIsEditing=function(e){a.setState({isEditing:e})},a.state=Object(m.a)(Object(m.a)({},a.state),{},{googleClientId:h,realmAppId:E,appName:j,copyrightLink:v,app:new g.a(E),user:null,dbCollection:null,filter:{region:"",owner:"",project_manager:"",name:""},sort:{field:"name",order:"ASC"},regionsList:[],ownersList:[],projectManagersList:[],loadProcessing:!1,projects:null,projectWithCurrentMilestone:null,isEditing:!1}),a.funcs={setUser:a.setUser,setClient:a.setClient,anonymousSignIn:a.anonymousSignIn,onGoogleSuccessSignIn:a.onGoogleSuccessSignIn,onGoogleSignInFailure:a.onGoogleSignInFailure,getUserAccessToken:a.getUserAccessToken,logOut:a.logOut,fetchFiltersDefaultValues:a.fetchFiltersDefaultValues,setLoadProcessing:a.setLoadProcessing,setProjects:a.setProjects,cleanLocalProjects:a.cleanLocalProjects,setFilter:a.setFilter,setSorting:a.setSorting,setProjectWithCurrentMilestone:a.setProjectWithCurrentMilestone,setIsEditing:a.setIsEditing},a}return Object(i.a)(n,[{key:"render",value:function(){return r.a.createElement(b.Provider,{value:Object(m.a)(Object(m.a)({},this.state),this.funcs)},this.props.children)}}]),n}(r.a.Component),S=n(399),k=n(543),x=n(525),I=n(526),M=n(282),P=n(400),N=n.n(P),T=n(100),R=n(352),L=n(351),D=n(524),F=Object(L.a)((function(e){return{paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},submit:{margin:e.spacing(3,0,2)},signInForm:{width:"100%",marginTop:e.spacing(1),display:"flex",justifyContent:"center"},errorBox:{width:"100%",marginTop:e.spacing(1),display:"flex",justifyContent:"center"}}}));function _(e){var t=e.googleClientId,n=e.appName,a=e.copyrightLink,o=e.onSuccess,c=e.onFailure,l=e.anonymousSignIn,i=e.signInError,s=F();return r.a.createElement(D.a,{component:"main",maxWidth:"xs"},r.a.createElement(x.a,null),r.a.createElement("div",{className:s.paper},r.a.createElement(k.a,{className:s.avatar},r.a.createElement(N.a,null)),r.a.createElement(T.a,{component:"h1",variant:"h5"},"Sign in"),r.a.createElement(R.a,{type:"submit",variant:"contained",color:"primary",className:s.submit,onClick:l},"Anonymous user"),r.a.createElement("div",{className:s.signInForm},r.a.createElement(S.GoogleLogin,{clientId:t,buttonText:"Sign in with Google",onSuccess:o,onFailure:c,scope:"email profile",responseType:"code"})),r.a.createElement("div",{className:s.signInForm}),i&&r.a.createElement("div",{className:s.errorBox},r.a.createElement(T.a,{variant:"body2",color:"error",align:"center"},i))),r.a.createElement(M.a,{mt:8},r.a.createElement(B,{appName:n,copyrightLink:a})))}function B(e){var t=e.appName,n=e.copyrightLink;return r.a.createElement(T.a,{variant:"body2",color:"textSecondary",align:"center"},"Copyright \xa9 ",r.a.createElement(I.a,{color:"inherit",href:n},t)," ",(new Date).getFullYear(),".")}_.defaultProps={signInError:null};var U=n(38),V=n(122),A=n(41),G=n(14),W=n(532),K=n(353),z=n(292),H=n(354),$=n(218),q=n(237),J=n.n(q),Q=n(232),Y=n.n(Q),X=n(421);function Z(e){var t=e.classes,n=e.inputPlaceHolder,a=e.onKeyDown,o=t.searchContainer,c=t.searchIcon,l=t.inputBaseRoot,i=t.inputBaseInput;return r.a.createElement("div",{className:o},r.a.createElement("div",{className:c},r.a.createElement(Y.a,null)),r.a.createElement(X.a,{placeholder:n,classes:{root:l,input:i},inputProps:{"aria-label":"search"},onKeyDown:a}))}var ee=n(527),te=n(529),ne=n(530),ae=n(531),re=n(290),oe=n(291),ce=n(297),le=n(234);function ie(e){var t=e.classes,n=e.filterButtonText,o=e.filterDialogTitle,c=e.filtersObject,l=e.applyButtonText,i=e.onApplyFilters,s=e.showEmptyValue,u=t.formContainer,m=Object(a.useState)(!1),p=Object(U.a)(m,2),f=p[0],d=p[1],g=function(){d(!1)};return r.a.createElement("div",{className:u},r.a.createElement(R.a,{onClick:function(){d(!0)},variant:"contained"},n),r.a.createElement(ee.a,{disableBackdropClick:!0,disableEscapeKeyDown:!0,open:f,onClose:g},r.a.createElement(te.a,null,o),r.a.createElement(ne.a,null,r.a.createElement("form",{className:u},c.map((function(e){return r.a.createElement(se,{classes:{formControl:t.formControl},label:e.label,currentValue:e.currentValue,values:e.values,setValue:e.setValue,showEmptyValue:s})})))),r.a.createElement(ae.a,null,r.a.createElement(R.a,{onClick:g,color:"primary"},"Cancel"),r.a.createElement(R.a,{onClick:function(){i(),d(!1)},color:"primary"},l))))}function se(e){var t=e.classes,n=e.label,a=e.currentValue,o=e.values,c=e.setValue,l=e.showEmptyValue,i=t.formControl;return r.a.createElement(re.a,{className:i},r.a.createElement(oe.a,{htmlFor:"demo-dialog-native"},n),r.a.createElement(ce.a,{native:!0,value:a,onChange:c,input:r.a.createElement(le.a,{id:"demo-dialog-native"})},l&&r.a.createElement("option",{value:""}),o.map((function(e){return r.a.createElement("option",{value:e},e)}))))}var ue=n(402),me=n.n(ue);function pe(e){var t=e.classes,n=e.menuId,a=e.mobileMenuId,o=e.onProfileMenuOpen,c=e.onMobileMenuOpen,l=t.sectionDesktop,i=t.sectionMobile;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:l},r.a.createElement(z.a,{edge:"end","aria-label":"account of current user","aria-controls":n,"aria-haspopup":"true",onClick:o,color:"inherit"},r.a.createElement(J.a,null))),r.a.createElement("div",{className:i},r.a.createElement(z.a,{"aria-label":"show more","aria-controls":a,"aria-haspopup":"true",onClick:c,color:"inherit"},r.a.createElement(me.a,null))))}var fe=Object(L.a)((function(e){return{grow:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:Object(A.a)({display:"none"},e.breakpoints.up("sm"),{display:"block"}),search:Object(A.a)({position:"relative",borderRadius:e.shape.borderRadius,backgroundColor:Object(G.d)(e.palette.common.white,.15),"&:hover":{backgroundColor:Object(G.d)(e.palette.common.white,.25)},marginRight:e.spacing(2),marginLeft:0,width:"100%"},e.breakpoints.up("sm"),{marginLeft:e.spacing(3),width:"auto"}),searchIcon:{padding:e.spacing(0,2),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"},inputRoot:{color:"inherit"},inputInput:Object(A.a)({padding:e.spacing(1,1,1,0),paddingLeft:"calc(1em + ".concat(e.spacing(4),"px)"),transition:e.transitions.create("width"),width:"100%"},e.breakpoints.up("md"),{width:"20ch"}),formContainer:{marginLeft:e.spacing(2)},formControl:{margin:e.spacing(1),minWidth:120},sectionDesktop:Object(A.a)({display:"none"},e.breakpoints.up("md"),{display:"flex"}),sectionMobile:Object(A.a)({display:"flex"},e.breakpoints.up("md"),{display:"none"})}}));function de(e){var t=fe(),n=e.fetchProjects,o=Object(a.useContext)(b),c=o.filter,l=o.setFilter,i=o.sort,s=o.setSorting,u=o.regionsList,p=o.ownersList,g=o.projectManagersList,h=o.fetchFiltersDefaultValues,j=o.setLoadProcessing,v=o.logOut;Object(a.useEffect)((function(){h()}),[]),Object(a.useEffect)((function(){j(!0),n({needToClean:!0})}),[c,i]);var E=Object(a.useState)(c),O=Object(U.a)(E,2),w=O[0],C=O[1],y=[{label:"Region",currentValue:w.region,values:u,setValue:function(e){C(Object(m.a)(Object(m.a)({},w),{},{region:e.target.value}))}},{label:"Owner",currentValue:w.owner,values:p,setValue:function(e){C(Object(m.a)(Object(m.a)({},w),{},{owner:e.target.value}))}},{label:"PM",currentValue:w.project_manager,values:g,setValue:function(e){C(Object(m.a)(Object(m.a)({},w),{},{project_manager:e.target.value}))}}],S=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;void 0!==e?(C(Object(m.a)(Object(m.a)({},w),{},{name:e})),l(Object(m.a)(Object(m.a)({},w),{},{name:e}))):l(w)},k=Object(a.useState)(i),x=Object(U.a)(k,2),I=x[0],M=x[1],P=[{label:"Field",currentValue:I.field,values:["name","region","owner"],setValue:function(e){M(Object(m.a)(Object(m.a)({},I),{},{field:e.target.value}))}},{label:"Order",currentValue:I.order,values:["ASC","DESC"],setValue:function(e){M(Object(m.a)(Object(m.a)({},I),{},{order:e.target.value}))}}],N=function(){var e=Object(d.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:"Enter"===t.key&&S(t.target.value);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),R="primary-search-account-menu",L=r.a.useState(null),D=Object(U.a)(L,2),F=D[0],_=D[1],B=r.a.useState(null),V=Object(U.a)(B,2),A=V[0],G=V[1],z=Boolean(F),H=Boolean(A),$=function(e){_(e.currentTarget)},q=function(){G(null)},J=function(){_(null),q()};return r.a.createElement("div",{className:t.grow},r.a.createElement(W.a,{position:"fixed"},r.a.createElement(K.a,null,r.a.createElement(T.a,{className:t.title,variant:"h6",noWrap:!0},"Projects"),r.a.createElement(Z,{classes:{searchContainer:t.search,searchIcon:t.searchIcon,inputBaseRoot:t.inputRoot,inputBaseInput:t.inputInput},inputPlaceHolder:"Search projects",onKeyDown:N}),r.a.createElement(ie,{classes:{formContainer:t.formContainer,formControl:t.formControl},filterButtonText:"Filters",filterDialogTitle:"Filter projects",filtersObject:y,applyButtonText:"Apply filters",onApplyFilters:S,showEmptyValue:!0}),r.a.createElement(ie,{classes:{formContainer:t.formContainer,formControl:t.formControl},filterButtonText:"Sort",filterDialogTitle:"Sort projects",filtersObject:P,applyButtonText:"Sort",onApplyFilters:function(){s(I)},showEmptyValue:!1}),r.a.createElement("div",{className:t.grow}),r.a.createElement(pe,{classes:{sectionDesktop:t.sectionDesktop,sectionMobile:t.sectionMobile},menuId:R,mobileMenuId:"primary-search-account-menu-mobile",onProfileMenuOpen:$,onMobileMenuOpen:function(e){G(e.currentTarget)}}))),r.a.createElement(be,{mobileMoreAnchorEl:A,mobileMenuId:"primary-search-account-menu-mobile",isMobileMenuOpen:H,onMobileMenuClose:q,onProfileMenuOpen:$}),r.a.createElement(ge,{anchorEl:F,menuId:R,isMenuOpen:z,onMenuClose:J,onLogOut:function(){v(),J()}}))}function ge(e){var t=e.anchorEl,n=e.menuId,a=e.isMenuOpen,o=e.onMenuClose,c=e.onLogOut;return r.a.createElement($.a,{anchorEl:t,anchorOrigin:{vertical:"top",horizontal:"right"},id:n,keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:a,onClose:o},r.a.createElement(H.a,{onClick:c},"Log Out"))}function be(e){var t=e.mobileMoreAnchorEl,n=e.mobileMenuId,a=e.isMobileMenuOpen,o=e.onMobileMenuClose,c=e.onProfileMenuOpen;return r.a.createElement($.a,{anchorEl:t,anchorOrigin:{vertical:"top",horizontal:"right"},id:n,keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:a,onClose:o},r.a.createElement(H.a,{onClick:c},r.a.createElement(z.a,{"aria-label":"account of current user","aria-controls":"primary-search-account-menu","aria-haspopup":"true",color:"inherit"},r.a.createElement(J.a,null)),r.a.createElement("p",null,"Profile")))}var he=n(516),je=n(536),ve=n(517),Ee=n(356),Oe=n(533),we=n(534),Ce=n(535),ye=n(355),Se=n(238),ke=Object(L.a)({root:{width:"55vh",marginBottom:5},info:{display:"inline-block",width:"100%"},leftInfo:{float:"left"},rightInfo:{float:"right"},title:{fontSize:14},pos:{marginBottom:12}});function xe(e){var t=ke(),n=e.psproject,o=Object(a.useContext)(b).setProjectWithCurrentMilestone;return r.a.createElement(Oe.a,{className:t.root},r.a.createElement(we.a,null,r.a.createElement("div",{className:t.info},r.a.createElement("div",{className:t.leftInfo},r.a.createElement(T.a,{className:t.title,color:"textSecondary",gutterBottom:!0},n.account)),r.a.createElement("div",{className:t.rightInfo},r.a.createElement(T.a,{className:t.title,color:"textSecondary",gutterBottom:!0},n.region))),r.a.createElement(T.a,{variant:"h5",component:"h2"},n.name),r.a.createElement("div",{className:t.info},r.a.createElement("div",{className:t.leftInfo},r.a.createElement(T.a,{className:t.pos,color:"textSecondary",gutterBottom:!0},"Owner: ",n.owner)),r.a.createElement("div",{className:t.rightInfo},r.a.createElement(T.a,{className:t.pos,color:"textSecondary",gutterBottom:!0},"PM: ",n.project_manager))),r.a.createElement(T.a,{variant:"body2",component:"p"},r.a.createElement("b",null,"Stage:")," ",n.details.pm_stage),r.a.createElement(T.a,{variant:"body2",component:"p"},r.a.createElement("b",null,"Status:")," ",n.details.pm_project_status),r.a.createElement(T.a,{variant:"body2",component:"p"},r.a.createElement("b",null,"Expires:")," ",Object(Se.toEnUsDate)(n.details.product_end_date)),r.a.createElement(Ce.a,null),r.a.createElement(Ie,{milestones:n.milestones,onClickMilestone:function(e){o({projectId:n._id,milestoneId:e._id})}})))}function Ie(e){var t=e.milestones,n=e.onClickMilestone;return r.a.createElement(he.a,{subheader:r.a.createElement("li",null)},r.a.createElement(je.a,null,"Milestones"),t.map((function(e){return r.a.createElement(ve.a,{button:!0,onClick:function(){return n(e)}},r.a.createElement(ye.a,{primary:e.name}))})))}function Me(e){var t=e.classes,n=Object(a.useContext)(b),o=n.loadProcessing,c=n.projects;return r.a.createElement(he.a,{component:"nav",className:t.listRoot,"aria-label":"contacts"},r.a.createElement(je.a,{color:"primary"},r.a.createElement(T.a,{variant:"h5"},"Total projects: ",c?c.length:0)),o&&r.a.createElement(ve.a,null,r.a.createElement(Ee.a,null)),!o&&c&&c.map((function(e){return r.a.createElement(ve.a,null,r.a.createElement(xe,{psproject:e}))})))}var Pe=n(541),Ne=n(151),Te=n(130),Re=n(293),Le=n.n(Re),De=n(405),Fe=n.n(De),_e=n(414),Be=n.n(_e),Ue=n(406),Ve=n.n(Ue),Ae=n(413),Ge=n.n(Ae),We=n(300),Ke=n.n(We),ze=n(299),He=n.n(ze),$e=n(407),qe=n.n($e),Je=n(408),Qe=n.n(Je),Ye=n(410),Xe=n.n(Ye),Ze=n(411),et=n.n(Ze),tt=n(412),nt=n.n(tt),at=n(415),rt=n.n(at),ot=n(409),ct=n.n(ot),lt=n(416),it=n.n(lt);function st(e){var t=e.onClickEditButton;return{Add:Object(a.forwardRef)((function(e,t){return r.a.createElement(Fe.a,Object.assign({},e,{ref:t}))})),Check:Object(a.forwardRef)((function(e,t){return r.a.createElement(Ve.a,Object.assign({},e,{ref:t}))})),Clear:Object(a.forwardRef)((function(e,t){return r.a.createElement(He.a,Object.assign({},e,{ref:t}))})),Delete:Object(a.forwardRef)((function(e,t){return r.a.createElement(qe.a,Object.assign({},e,{ref:t}))})),DetailPanel:Object(a.forwardRef)((function(e,t){return r.a.createElement(Ke.a,Object.assign({},e,{ref:t}))})),Edit:Object(a.forwardRef)((function(e,n){return r.a.createElement(Qe.a,Object.assign({},e,{ref:n,onClick:t}))})),Export:Object(a.forwardRef)((function(e,t){return r.a.createElement(ct.a,Object.assign({},e,{ref:t}))})),Filter:Object(a.forwardRef)((function(e,t){return r.a.createElement(Xe.a,Object.assign({},e,{ref:t}))})),FirstPage:Object(a.forwardRef)((function(e,t){return r.a.createElement(et.a,Object.assign({},e,{ref:t}))})),LastPage:Object(a.forwardRef)((function(e,t){return r.a.createElement(nt.a,Object.assign({},e,{ref:t}))})),NextPage:Object(a.forwardRef)((function(e,t){return r.a.createElement(Ke.a,Object.assign({},e,{ref:t}))})),PreviousPage:Object(a.forwardRef)((function(e,t){return r.a.createElement(Ge.a,Object.assign({},e,{ref:t}))})),ResetSearch:Object(a.forwardRef)((function(e,t){return r.a.createElement(He.a,Object.assign({},e,{ref:t}))})),Search:Object(a.forwardRef)((function(e,t){return r.a.createElement(Y.a,Object.assign({},e,{ref:t}))})),SortArrow:Object(a.forwardRef)((function(e,t){return r.a.createElement(Be.a,Object.assign({},e,{ref:t}))})),ThirdStateCheck:Object(a.forwardRef)((function(e,t){return r.a.createElement(rt.a,Object.assign({},e,{ref:t}))})),ViewColumn:Object(a.forwardRef)((function(e,t){return r.a.createElement(it.a,Object.assign({},e,{ref:t}))}))}}function ut(e){var t=e.projectId,n=e.tableName,o=e.currentColumns,c=e.currentData,l=e.onUpdate,i=e.fetchProjects,s=Object(a.useContext)(b),u=s.isEditing,m=s.setIsEditing,p=Object(a.useState)(o),g=Object(U.a)(p,2),h=g[0],j=g[1],v=Object(a.useState)(c),E=Object(U.a)(v,2),O=E[0],w=E[1];Object(a.useEffect)((function(){u||j(o)}),[u,t,o]),Object(a.useEffect)((function(){u||w(c)}),[u,t,c]);return r.a.createElement(Le.a,{title:n,icons:st({onClickEditButton:function(){return m(!0)}}),columns:h,data:O,editable:{isEditable:function(e){return e.editable},onRowUpdate:function(){var e=Object(d.a)(f.a.mark((function e(t,n){var a,r,o,c;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.tableKey,r=t.updateKey,e.next=4,l({updateKey:r,value:t[a]});case 4:o=Object(Te.a)(O),c=n.tableData.id,o[c]=t,w(Object(Te.a)(o)),i({needToClean:!1}),m(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(0),console.error(e.t0),m(!1);case 16:case"end":return e.stop()}}),e,null,[[0,12]])})));return function(t,n){return e.apply(this,arguments)}}(),onRowUpdateCancelled:function(){return m(!1)}}})}function mt(e){var t=e.classes,n=e.project,o=e.fetchProjects,c=Object(a.useContext)(b).dbCollection,l=function(e){if(!e)return{milestonesTableColumns:[],milestonesTableRows:[]};var t=e.owner,n=e.region,a=e.project_manager,r=e.account,o=e.name,c=e.opportunity,l=e.details,i=e.currentMilestone;return{milestonesTableColumns:[{title:"Project / Milestone Fields",field:"name",editable:"never"},{title:"Value",field:"value",editable:"onUpdate"}],milestonesTableRows:[{name:"Project Owner",value:t,editable:!1},{name:"Region",value:n,editable:!1},{name:"Project Manager",value:a,editable:!1},{name:"PM Stage",value:l.pm_stage,editable:!0,tableKey:"value",updateKey:"details.pm_stage"},{name:"Account",value:r,editable:!1},{name:"Opportunity",value:c.name,editable:!1},{name:"PS Project Name",value:o,editable:!1},{name:"Milestone Name",value:i.name,editable:!1},{name:"Country",value:i.country,editable:!1},{name:"Milestone amount",value:i.base.milestone_amount,editable:!1},{name:"Gap Hours",value:i.base.gap_hours,editable:!1}]}}(n),i=l.milestonesTableColumns,s=l.milestonesTableRows,u=function(e){return e?{scheduleTableColumns:[{title:"Date",field:"date",editable:"never"},{title:"Scheduled",field:"scheduled",editable:"never"},{title:"Hours",field:"hours",editable:"never"}],scheduleTableRows:e.currentMilestone.schedule.map((function(e){return{date:Object(Se.toEnUsDate)(e.week),scheduled:e.revenue?"$ ".concat(e.revenue):"-",hours:e.hours?e.hours:"-",editable:!1}}))}:{scheduleTableColumns:[],scheduleTableRows:[]}}(n),m=u.scheduleTableColumns,p=u.scheduleTableRows,g=function(){var e=Object(d.a)(f.a.mark((function e(t){var a,r,o,l,i;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.updateKey,r=t.value,o={_id:n._id},l={$set:Object(A.a)({},a,r)},i={upsert:!1},e.next=6,c.updateOne(o,l,i);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement(r.a.Fragment,null,0!==s.length&&r.a.createElement("div",{className:t.tableContainer},r.a.createElement(ut,{projectId:n._id,tableName:"Project milestone info",currentColumns:i,currentData:s,onUpdate:g,fetchProjects:o})),0!==p.length&&r.a.createElement("div",{className:t.tableContainer},r.a.createElement(ut,{projectId:n._id,tableName:"Schedule",currentColumns:m,currentData:p})))}var pt=Object(L.a)({tableContainer:{marginTop:"20px"}});function ft(e){var t=pt(),n=e.classes,o=e.fetchProjects,c=Object(a.useContext)(b),l=c.projectWithCurrentMilestone,i=c.projects,s=null,u=null;if(l){var p=l.projectId,f=l.milestoneId,d=i.filter((function(e){return e._id===p}));if(d&&d.length){var g=(s=d[0]).milestones.filter((function(e){return e._id===f}));u=g&&g.length?g[0]:null}}return r.a.createElement(Pe.a,{container:!0},r.a.createElement(Pe.a,{item:!0,xs:12},r.a.createElement(Ne.a,{className:n.paper},r.a.createElement(T.a,{variant:"h4",gutterBottom:!0},"Milestones overview"),r.a.createElement(Ce.a,null),s&&u?r.a.createElement(mt,{classes:t,project:Object(m.a)(Object(m.a)({},s),{},{currentMilestone:u}),fetchProjects:o}):r.a.createElement("div",{className:t.tableContainer},r.a.createElement(T.a,{variant:"body1"},"Click on project milestone to see an overview...")))))}var dt=Object(L.a)((function(e){return{container:{marginTop:70,display:"flex",flexDirection:"row"},root:{width:"90vh",backgroundColor:e.palette.background.paper,position:"relative",overflow:"auto",minHeight:"90vh",height:"90vh"},paper:{padding:e.spacing(1),textAlign:"center",color:e.palette.text.primary,whiteSpace:"normal",marginBottom:e.spacing(1),marginLeft:e.spacing(2),marginRight:e.spacing(1),maxHeight:"90vh",overflow:"auto"}}}));function gt(e){var t=dt(),n=e.fetchProjects;return r.a.createElement("div",{className:t.container},r.a.createElement(Me,{classes:{listRoot:t.root}}),r.a.createElement(ft,{classes:{paper:t.paper},fetchProjects:n}))}var bt=n(417),ht=n(120);function jt(){var e=Object(bt.a)(["\n    query FindProjectsCustomResolver($filtersInput: FiltersInput!) {\n        psprojectsData(input: $filtersInput) {\n            _id\n            account\n            active\n            details {\n                pm_stage\n                pm_project_status\n                product_end_date\n            }\n            opportunity {\n                name\n                owner\n                engagement_manager\n            }\n            milestones {\n                _id\n                country\n                currency\n                name\n                base {\n                    milestone_amount\n                    gap_hours\n                }\n                schedule {\n                    week\n                    revenue\n                    hours\n                }\n            }\n            name\n            owner\n            project_manager\n            region\n            stage\n        }\n    }\n"]);return jt=function(){return e},e}var vt=n.n(ht)()(jt());function Et(){var e=Object(a.useContext)(b),t=e.setProjects,n=e.setLoadProcessing,o=e.cleanLocalProjects,c=e.filter,l=e.sort,i={variables:{filtersInput:{filter:Object(m.a)(Object(m.a)({},c),{},{active:!0}),sort:{field:l.field,order:"DESC"===l.order?-1:1}}}},s=null,u=Object(V.useQuery)(vt,Object(m.a)(Object(m.a)({},i),{},{notifyOnNetworkStatusChange:!0,onCompleted:function(e){t(e.psprojectsData),s=setTimeout(u,5e3)}})).refetch,p=Object(V.useLazyQuery)(vt,Object(m.a)(Object(m.a)({},i),{},{onCompleted:function(e){t(e.psprojectsData),n(!1),s=setTimeout(u,5e3)},fetchPolicy:"network-only"})),g=Object(U.a)(p,1)[0],h=function(){var e=Object(d.a)(f.a.mark((function e(t){var n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.needToClean,s&&clearTimeout(s),e.t0=n,!e.t0){e.next=6;break}return e.next=6,o();case 6:return e.next=8,g();case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement(r.a.Fragment,null,r.a.createElement(de,{fetchProjects:h}),r.a.createElement(gt,{fetchProjects:h}))}function Ot(){var e=Object(a.useContext)(b),t=e.realmAppId,n=e.getUserAccessToken,o=e.user,c=Object(a.useState)(wt(t,n)),l=Object(U.a)(c,2),i=l[0],s=l[1];return Object(a.useEffect)((function(){s(wt(t,n))}),[o]),r.a.createElement(V.ApolloProvider,{client:i},r.a.createElement(Et,null))}function wt(e,t){var n="https://realm.mongodb.com/api/client/v2.0/app/".concat(e,"/graphql");return new V.ApolloClient({link:new V.HttpLink({uri:n,fetch:function(e){function t(t,n){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=Object(d.a)(f.a.mark((function e(n,a){var r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:return r=e.sent,a.headers.Authorization="Bearer ".concat(r),e.abrupt("return",fetch(n,a));case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}())}),cache:new V.InMemoryCache})}function Ct(){var e=Object(a.useContext)(b),t=e.app,n=e.appName,o=e.copyrightLink,c=e.googleClientId,l=e.anonymousSignIn,i=e.user,s=e.setUser,u=e.onGoogleSuccessSignIn,m=e.onGoogleSignInFailure,p=Object(a.useRef)(t);return Object(a.useEffect)((function(){s(t.currentUser)}),[p.current.currentUser]),r.a.createElement(r.a.Fragment,null,!i&&r.a.createElement(_,{onSuccess:u,appName:n,copyrightLink:o,googleClientId:c,onFailure:m,anonymousSignIn:l}),i&&r.a.createElement(Ot,null))}n(504);var yt=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(y,null,r.a.createElement(Ct,null)))}}]),n}(a.Component);c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(yt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[427,1,2]]]);
//# sourceMappingURL=main.a5f0c151.chunk.js.map