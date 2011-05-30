function AG(datasets, labels) {
	var self = this;

	self.datasets = datasets;
	self.labels = labels;

	self.dataset = null;
	self.current_chart_type = null;
	self.current_elements = null;


	self.chart_functions =  {
					'bar_grouped': raphael.g.barchart,
				};


	self.set_dataset = function(label) {
		self.dataset = self.datasets[labels.indexOf(label)];
	};

	self.dataset_to_input = function(labels) {

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
}


//var ag = new AG({}, []);
//
//e.bind('click', ag.chart);
