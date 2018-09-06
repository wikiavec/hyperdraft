/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotesAppInteraction = global.WKCNotesAppInteraction || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCNotesAppPerformDataJoinWithItemsArrayAndSharedData

	exports.WKCNotesAppPerformDataJoinWithItemsArrayAndSharedData = function (itemsArray, sharedData) {
		var selection = d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(itemsArray);
		
		selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.on('click', function(d) {
					d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', false);
					d3.select(this).classed('WKCAppNotesListItemSelected', true);

					return exports.WKCNotesAppCommandsSelectItem(d, sharedData);
				})
				.merge(selection)
					.html(function(d) {
						return [
							'<pre>',
							(d.WKCNoteBody || '').split('\n').slice(0, 3).join('\n'),
							'</pre>',
						].join('');
					});

		selection.exit().remove();
	};

	//_ WKCNotesAppCommandsSelectItem

	exports.WKCNotesAppCommandsSelectItem = function (item, sharedData) {
		sharedData.WKCAppNotesSharedSelectedItem = item;
		d3.select('#WKCNotesAppEditorTextarea').node().value = item.WKCNoteBody;
		d3.select('#WKCNotesAppEditorTextarea').node().focus();

		d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', function(d) {
			return d === item;
		});
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
