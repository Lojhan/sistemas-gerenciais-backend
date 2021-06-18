import { EntityRepository, Repository } from 'typeorm';
import { ProductStockRelation } from '../entities/product_stock.entity';
import { PSSRelation } from '../entities/prod_stock_sale.entity';
import { Sale } from '../entities/sale.entity';
import { User } from '../entities/user.entity';
import * as events from 'events';

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> {
  async sell(user: User, sales: any[]) {
    try {
      const sale = this.create();
      const relation = [];
      sale.client = user;
      await sale.save();

      await Promise.all(
        sales.map(async (s) => {
          const psRelation = await ProductStockRelation.findOne({
            where: { product: s.product.product, stock: s.product.stock },
          });
          const ProductStockSaleRelation = new PSSRelation();
          ProductStockSaleRelation.psRelation = psRelation;
          ProductStockSaleRelation.quantity = s.quantity;
          ProductStockSaleRelation.priceAtTime = s.product.product.listPrice;
          ProductStockSaleRelation.sale = sale;

          relation.push(ProductStockSaleRelation);
          await ProductStockSaleRelation.save();
          delete ProductStockSaleRelation.sale;
        }),
      );

      await sale.save();

      sale.relation = relation;
      events.prototype.emit('initSale', sale);

      return sale;
    } catch (e) {
      console.log(e);
    }
  }
}
