/*** 
    .: FlagEnum and FlagSel :.

    // Dependencies: underscore.js

    // Example:
    _w.Feature = new FlagEnum("Feature", {
          CUSTOMER      : "customer info"             // 2
        , ORDER         : "order details"             // 4
        , DELIVERY      : "delivery details"          // 8 
        , DELIVERY_LIST : "listing of all deliveries" // 16
        , DRIVER        : "driver details"            // 32
    })
    let [CUSTOMER, ORDER, DELIVERY, DELIVERY_LIST, DRIVER] = Feature.get_values()

    features = new FlagSel(Feature, CUSTOMER | ORDER | DELIVERY)
    // -or-
    features = new FlagSel(Feature, [CUSTOMER, ORDER, DELIVERY])

    // Using in code

    // Check feature using bitwise mask:
    if (features & ORDER){
        pc("features includes ORDER")
    }
    // -or-
    // Check feature using has method:
    if (features.has(ORDER)){
        pc("features includes ORDER")
    }

    // Managing values:
    features.add(CUSTOMER)
    features.rem(ORDER)

    // Print available options
    console.log(Feature)
    // output: <FlagEnum - Feature> options: CUSTOMER, ORDER, DELIVERY, DELIVERY_LIST, DRIVER

    // Print selected options
    console.log(features)
    // output: <FlagSel - Feature> CUSTOMER, ORDER, DELIVERY

***/


function FlagEnum(name, spec){
    var t=this,n=0
    t.__name__ = name
    t.__k__ = []
    t.__d__ = []
    t.__n__ = []
    t.__max__ = 0
    for (var k in spec){
        t.__k__.push(k)
        t.__d__.push(spec[k])
        n = n===0?1:n*2
        t.__n__.push(n)
        t[k] = n
        t.__max__ = t.__max__ | n
    }
    return t
}
_FEP = FlagEnum.prototype
_FEP.toString = function FlagEnum_toString(verbose){
    var t=this
    let sb = [`<FlagEnum> ${t.__name__} avail: `]
    for (var i=0; i<t.__k__.length; i++){ 
        if (i > 0) sb.push(", ")
        sb.push(t.__k__[i])
        if (verbose)sb.a(" - '").push(t.__d__[i]).a("'")
    }
    return sb.join('')
}
_FEP.get_values = function FlagEnum_get_values(){
    return this.__n__
}


function FlagSel(fenum, v){
    var t=this, val=-1
    t.__fenum__ = fenum
    if (!fenum || !(fenum instanceof FlagEnum))throw new Error(`fenum must be an instance of FlagEnum but got ${getClassName(fenum)}`)
    if (_.isInteger(v)){
        t.__value__ = v
    } else if (_.isArray(v)) {
        var flags = v
        t.__value__ = 0
        for (var i=0; i<flags.length; i++){
            n = flags[i]
            if (!_.isInteger(n))throw new Error(`flags must contain only integers within ${fenum.__name__} FlagEnum`)
            n = parseInt(n)
            if (fenum.__n__.indexOf(n) == -1)throw new Error(`integer flag '${n}' not found within ${fenum.__name__} FlagEnum. Valid values ${fenum.__n__}`)
            t.__value__ = t.__value__ | n
        }
    } else{
        throw new Error("Invalid v argument. Expecting int or array of int")
    }
    return t
}
_FSP = FlagSel.prototype
_FSP.valueOf = function FlagSel_valueof(){return this.__value__}
_FSP.toString = function FlagEnum_toString(verbose){
    var t=this, fe = t.__fenum__, sb = [`<FlagSel - ${fe.__name__}> `]
    for (var i=0, c=0; i<fe.__k__.length; i++){
        if (t.__value__ & fe.__n__[i]){
            if (c++ > 0) sb.push(", ")
            sb.push(fe.__k__[i])
            if (verbose)sb.a(" - '").push(fe.__d__[i]).a("'")
        }
    }
    return sb.join('')
}
_FSP.has = function FlagEnum_has(flag){
    var t=this, fe = t.__fenum__
    if ((t.__value__ & flag) === flag){ return true }
    t.valid_flag(flag, true)
    return false
}
_FSP.valid_flag = function FlagEnum_valid_flag(flag, asrt){
    var t=this, fe = t.__fenum__
    if (fe.__n__.indexOf(flag) == -1){
        if (asrt){ throw new Error(`Invalid flag. Expecting value from ${fe.__name__} but got ${}`)}
        return false
    }
    return true
}
_FSP.add = function FlagEnum_add(flag){
    var t=this, fe = t.__fenum__
    t.valid_flag(flag, true)
    t.__value__ += flag
}
_FSP.rem = function FlagEnum_rem(flag){
    var t=this, fe = t.__fenum__
    t.valid_flag(flag, true)
    t.__value__ -= flag
}


// 
function getClassName(o){
    if(o===undefined){return "(undefined)" }
    if(o===null){return "(null)"}
    var c = o.constructor
    if( (v = c.name) ) {
        if (v === 'd') return 'dayjs'
        return v
    }
    return funcName(c)
}
var RE_FUNC_DEF = new RegExp("^\\s*function\\s*(\\S*)\\s*\\((.*)\\)");
function funcName(f){
    if (!f) return("(funcName() - f is Nothing!)")
    if(!_.isFunction(f))return("(funcName() - f is not a function!) - f = " + String(f))
    var s = f.toString(), m = s.match(RE_FUNC_DEF)
    if (m && m.length > 1) return m[1]
    return null
}