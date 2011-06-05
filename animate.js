/*
 *
 * AnimatedGraphs:
 * datasets = array of objects, e.g. [{male: {asian: 1, african: 2}, female: {asian: 3, african: 2}}]
 * labels = labels for objects, e.g. ['gender', 'ethnicity']
 *
 */

function AG(datasets, labels) {
    var self = this;

    self.datasets = datasets;
    self.datasets_raw = [];
    self.labels = labels;

    self.dataset = null;
    self.dataset_raw = null;
    self.current_chart_type = null;
    self.current_elements = null;
    self.size_x = 400;
    self.size_y = 400;

    self.raphael = new Raphael();
    var raphael = self.raphael;
    var width = raphael.width;
    var height = raphael.height;


    self.chart_functions =  {
                    'bar_grouped': function(values) { return raphael.g.barchart_paths(0,0,width,height,values); },
                };


    /* 
     * switch dataset
     */
    self.set_dataset = function(id) {
        self.dataset = self.datasets[id];
        self.dataset_raw = self.datasets_raw[id];
    };

    /* 
     * annotate
     * prepend object keys in datasets with their respective labels
     * (for unique identification later on)
     */
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

    /*
     * summarize
     * basically denormalize datasets in this.datasets_raw
     * enables easier filtering and transformations later on
     */
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


    /*
     * draw/change chart
     *
     * e.g.
     * chart('bar', ['gender']);
     * or
     * chart('bar-grouped', ['gender', 'ethnicity'])
     */
    self.chart = function(chart_type, labels) {
        var old_chart_type = chart_type;
        var old_elements = self.current_elements;
        self.current_elements = [];

        var data = self.get_data(labels);

        var chart_function = self.chart_functions[chart_type];

        var g = chart_function(data);
        if(old_elements) {
            // TBI
        } else {
            for(var i=0;i<g.elements.length;i++) {
                self.current_elements.push(raphael.path(g.elements[i].path));
            }
        }
    };



    /*
     * get_data
     * get data formatted for g.raphael-like input
     */
    self.get_data = function(labels) {
        var dataset = self.dataset_raw;
        var raw_values = {};
        var lbls = labels;

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
            raw_values[newkey] = (raw_values[newkey]||0) + val;
        }

        var result = [];
        for(var key in raw_values) {
            if(!raw_values.hasOwnProperty(key))
                continue;
            var value = raw_values[key];
            result.push({'filter': key, 'value': value});
        }
        result.sort(function(x,y) {
            var k1 = JSON.parse(x.filter);
            var k2 = JSON.parse(y.filter);
            for(var i=0;i<lbls.length;i++) {
                var lbl = lbls[i];
                if(k1[lbl] == k2[lbl])
                    continue;
                return k1[lbl] < k2[lbl];
            }
            return 0;
        });


        return result;
    };


    self.annotate_datasets();
    self.summarize_datasets();

    self.set_dataset(0);
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

