import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodItemService } from '../service/fooditem.service';
import { FoodCataloguePage } from 'src/app/Shared/models/FoodCataloguePage';
import { FoodItem } from 'src/app/Shared/models/FoodItem';

@Component({
  selector: 'app-food-catalogue',
  templateUrl: './food-catalogue.component.html',
  styleUrls: ['./food-catalogue.component.scss']
})
export class FoodCatalogueComponent implements OnInit {

  restaurantId: number;
  foodItemResponse: FoodCataloguePage;
  foodItemCart: { [key: number]: number } = {};  // Track user-selected quantities separately
  orderSummary: FoodCataloguePage & { total: number };

  constructor(private route: ActivatedRoute, private foodItemService: FoodItemService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.restaurantId = +params.get('id');
      this.getFoodItemsByRestaurant(this.restaurantId);
    });
  }

  getFoodItemsByRestaurant(restaurant: number) {
    this.foodItemService.getFoodItemsByRestaurant(restaurant).subscribe(
      data => {
        this.foodItemResponse = data;
      }
    );
  }

  getQuantity(food: FoodItem): number {
    return this.foodItemCart[food.id] || 0;
  }

  increment(food: FoodItem) {
    if (this.getQuantity(food) < food.quantity) {
      this.foodItemCart[food.id] = this.getQuantity(food) + 1;
    }
  }

  decrement(food: FoodItem) {
    if (this.getQuantity(food) > 0) {
      this.foodItemCart[food.id] = this.getQuantity(food) - 1;
      if (this.foodItemCart[food.id] === 0) {
        delete this.foodItemCart[food.id];
      }
    }
  }

  calculateTotal(): number {
    return this.foodItemResponse.foodItemsList.reduce((acc, food) => {
      const quantity = this.getQuantity(food);
      return acc + food.price * quantity;
    }, 0);
  }

  onCheckOut() {
    const foodItemsList = this.foodItemResponse.foodItemsList.filter(food => this.getQuantity(food) > 0).map(food => ({
      ...food,
      quantity: this.getQuantity(food)
    }));

    this.orderSummary = {
      foodItemsList,
      restaurant: this.foodItemResponse.restaurant,
      total: this.calculateTotal()
    };
    this.router.navigate(['/orderSummary'], { queryParams: { data: JSON.stringify(this.orderSummary) } });
  }
}

