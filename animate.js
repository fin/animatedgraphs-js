function AG(datasets, labels) {
    var self = this;

    self.datasets = datasets;
    self.datasets_raw = [];
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
                input[self.labels[level]+':'+k] = input[k];
                delete input[k];
            }
        };
        annotate(dataset, 0, {});
    };

    self.summarize_datasets = function() {
        for(var i=0;i<self.datasets.length;i++) {
            self.summarize_dataset(i);
        }
    };
    self.summarize_dataset = function(dataset_index) {
        var dataset = self.datasets[dataset_index];
        self.datasets_raw.push(self.summarize_dataset_recurse(dataset, [],0));
    };
    self.summarize_dataset_recurse = function(obj, current_key, depth) {
        var result = {};
        if(Raphael.is(obj, 'object')) {
            for(var key in obj) {
                if(!obj.hasOwnProperty(key))
                    continue;
                var val = obj[key];
                var ck = current_key.clone();
                ck[self.labels[depth]]=key;
                result = result.merge(self.summarize_dataset_recurse(val, ck, depth+1));
            }
            return result;
        } else {
            result[current_key.jsonproper()] = obj;
            return result;
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
        var dataset = self.datasets_raw[index];
        var result = {};
        for(var key in dataset) {
            var val = dataset[key];
            if(!dataset.hasOwnProperty(key))
                continue;
            var obj = JSON.parse(key);
            var newkey = {};
            for(var i=0;i<labels.length;i++) {
                newkey[labels[i]] = obj[labels[i]];
            }
            newkey = newkey.jsonproper();
            result[newkey] = (result[newkey]||0) + val;
        }
        return result;
    };


    self.annotate_datasets();
    self.summarize_datasets();
}


//var ag = new AG({}, []);
//
//e.bind('click', ag.chart);
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

Object.prototype.jsonproper = function() {
    var keys = [];
    for(var key in this) {
        if(!this.hasOwnProperty(key))
            continue;
        keys.push(key);
    }
    keys.sort();
    var result = {};
    for(var i=0;i<keys.length;i++) {
        result[keys[i]] = this[keys[i]];
    }
    return JSON.stringify(result);
};
Object.prototype.merge = (function (ob) {var o = this;var i = 0;for (var z in ob) {if (ob.hasOwnProperty(z)) {o[z] = ob[z];}}return o;})

