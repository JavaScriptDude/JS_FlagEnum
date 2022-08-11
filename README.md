# JS_FlagEnum
This is an way of defining and using Flag Enums in JavaScript

By using integers for values, the selections can be easily passed across languages and platforms.

```javascript
    // Example:
    Feature = new FlagEnum("Feature", {
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
        console.log("features includes ORDER")
    }
    // -or-
    // Check feature using has method:
    if (features.has(ORDER)){
        console.log("features includes ORDER")
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

```
