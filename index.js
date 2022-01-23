const data = require('./data.json');

let trades = [];
let counter = 0;
// Iterate JSON Object from End
for (i=Object.keys(data).length-1;i>-1;i--) {
    // If fill is a close
    if (data[i].JSON.PositionQuantity == 0) {
        // Get counter fills back added
        let executions = []
        // Add open fills to executions
        for(j=0;j<=counter;j++) {
            executions.push(data[i+j]);
            console.log("EXE ADDED " + j + "/" + i + "   " +  data[i+j].JSON.InternalOrderID)
        }
        console.log("NEW POSITION")
        // Push new set of executions to trades array.
        trades.push(executions);
        counter=0;
    }
    else {
        counter++;
        console.log("OPEN " + counter + "    " +  data[i].JSON.InternalOrderID)
    }
}

//console.log(trades[0])