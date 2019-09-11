import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  itemquantity = new FormControl('', [Validators.required, Validators.requiredTrue]);
  itemname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  itemprice = new FormControl('', [Validators.required, Validators.requiredTrue]);
  constructor(private dialogRef: MatDialogRef<ItemListComponent>) { }

  ngOnInit() {
  }

  async addItem()
  {
    var itemquantityVal = this.itemquantity.value as number;
    const itemnameVal = this.itemname.value as string;
    const itempriceVal = this.itemprice.value as number;
    const relatedTo = /* find the event */null;

    if (itemquantityVal == null)
    {
      itemquantityVal = 1;
    }

    var item = Parse.Object.extend('Item');
    var newItem = new item();

    newItem.set('name', itemnameVal);
    newItem.set('quantity', itemquantityVal);
    newItem.set('price', itempriceVal);
    newItem.set('relatedTo', relatedTo);

    newItem.save()
    .then(err => {
      alert('Oops ! Something goes wrong !');
    })
  }

}
