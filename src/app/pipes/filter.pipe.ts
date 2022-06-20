import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
    
export class FilterPipe implements PipeTransform {
    transform(items: any[], bookTitle: string, filterMetadata: any): any[]  {
      
        if (!items) return [];
        
        if (!bookTitle) {
            filterMetadata.count = items.length;
            return items;
        };
   
        let filteredItems = items.filter( el => {
            return el.name.toLowerCase().includes(bookTitle.toLowerCase());
        });

        filterMetadata.count = filteredItems.length;
        return filteredItems;
  
   }
}