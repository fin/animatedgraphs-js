function AG(datasets, labels) {
    var self = this;

    self.datasets = datasets;
    self.dataset_sums = [];
    self.labels = labels;

    self.dataset = null;
    self.current_chart_type = null;
    self.current_elements = null;


    self.chart_functions =  {
                    'bar_grouped': raphael.g.barchart,
                };


    self.set_dataset = function(id) {
        self.dataset = self.datasets[id];
    };

    self.annotate_datasets = function() {
        for(var i=0;i<self.datasets.length;i++) {
            self.annotate_dataset(self.datasets[i]);
        }
    };

    self.annotate_dataset = function(dataset) {
        var annotate = function(input, level) {
            for(var k in input) {
                if(!input.hasOwnProperty(k))
                    continue;
                annotate(input[k], level+1);
                input[self.labels[level]+'-'+k] = input[k];
                delete input[k];
            }
        };
        annotate(dataset, 0);
    };

    self.summarize_datasets = function() {
        for(var i=0;i<self.datasets.length;i++) {
            self.summarize_dataset(i);
        }
    };
    self.summarize_dataset = function(dataset_index) {
        var result = {};
        for(var index=0;index<self.labels.length;index++) {
            result[self.labels[index]] = self.summarize_dataset_recurse(self.datasets[dataset_index], index);
        }
        self.dataset_sums.push(result);
    };
    self.summarize_dataset_recurse = function(obj, depth) {
        if(depth<0) {
            if(Raphael.is(obj, 'object')) {
                var sum = 0;
                for(var key in obj) {
                    if(!obj.hasOwnProperty(key))
                        continue;
                    sum += self.summarize_dataset_recurse(obj[key], depth-1);
                }
                return sum;
            } else {
                return obj;
            }
        } else if(depth==0) {
            var result = {};
            for(var key in obj) {
                if(!obj.hasOwnProperty(key))
                    continue;
                result[key]=self.summarize_dataset_recurse(obj[key], depth-1);
            }
            return result;
        } else {
            var results = {};
            var temp_results = []
            for(var key in obj) {
                if(!obj.hasOwnProperty(key))
                    continue;
                temp_results.push(self.summarize_dataset_recurse(obj[key], depth-1));
            }
            console.log(temp_results);
            for(var index in temp_results) {
                var temp_result = temp_results[index];
                for(var key in temp_result) {
                    if(!temp_result.hasOwnProperty(key))
                        continue;
                    results[key] = (key in results?results[key]:0) + temp_result[key];
                }
            }
            return results;
        }
    };


    self.chart = function(chart_type, labels) {
        var old_chart_type = chart_type;
        var old_elements = self.current_elements;

        var chart_function = self.chart_functions[chart_type];

        chart_function(10,10,300,300, data);
        
        if(old_elements) {
            // TBI
        } else {
        }
    };



    self.get_data = function(index, labels) {
    };




    self.annotate_datasets();
}


//var ag = new AG({}, []);
//
//e.bind('click', ag.chart);
