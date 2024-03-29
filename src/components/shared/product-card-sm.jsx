import React from 'react';
import {
  calDiscountPercentage,
  calculateProductPriceAfterDiscount,
  capitalizeStr,
  shorten_the_name_upto_six
} from '../../utils/utils';

const fileUrl = process.env.REACT_APP_FILE_URL;

const ProductCardSM = ({ product }) => {

  product['images'] = JSON.parse(product.image);
  product.slug = product.slug;

  return (
    <>
      <div className="card">
        <a href={`/productDetails/${product.slug}`} >
          <img
            className="card-img-top"
            src={`${fileUrl}/upload/product/compressedProductImages/${product.home_image}`}
            // onMouseOver={(e) =>           
            //   (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${product.images[1].imageName}`)
            // }
            // onMouseOut={(e) =>
            //   (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${product.home_image}`)
            // }
            alt={capitalizeStr(product.product_name)}
            title={capitalizeStr(product.product_name)}
          />
        </a>

        {/* desktop  */}
        <div className="d-none d-lg-block">
          {product.newProduct === 1 && (
            <span className="product-new-label-small-slider">New</span>
          )}

          {product.discountAmount != 0 && (
            <span className="product-new-label-discount-small-slider">
              {calDiscountPercentage(
                product.discountAmount,
                product.productPrice,
              )}
              %
            </span>
          )}

        </div>

        {/* mobile */}
        <div className="d-lg-none d-block">
          {product.newProduct === 1 && (
            <span className="product-new-label-small-carousel">New</span>
          )}

          {product.discountAmount != 0 && (
            <span className="product-new-label-discount-small-carousel">
              {calDiscountPercentage(
                product.discountAmount,
                product.productPrice,
              )}
              %
            </span>
          )}
        </div>


        <div className="card-body">
          <div className="text-center">
            <h1 className="card-title h6">
              <a href={`/productDetails/${product.slug}`} >
                <span className="text-primary">
                  {capitalizeStr(shorten_the_name_upto_six(product.product_name))}
                </span>
              </a>
            </h1>

            <p className="card-text">
              {/* ৳&nbsp;{product.productPrice - product.discountAmount}
              {product.discountAmount > 0 && (
                <span>৳&nbsp;{product.productPrice}</span>
              )} */}

              <span className={(calculateProductPriceAfterDiscount(product.productPrice, product.discountAmount) > 0 ? 'strikediag' : '')}>
                ৳&nbsp;{product.productPrice}
              </span>
              &nbsp;
              {calculateProductPriceAfterDiscount(product.productPrice, product.discountAmount) > 0 && (
                <span className='custom-cart-discount-font-size'>৳&nbsp;{calculateProductPriceAfterDiscount(product.productPrice, product.discountAmount)}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .custom-cart-title-font-size {
          font-size: 0.85rem;
        }

        .custom-cart-discount-font-size {
          font-size: 1.5 rem;
          font-weight: bold;
        }

        .custom-cart-text-font-size {
          font-size: 0.75rem;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .capitalizeStr {
          text-transform: capitalize;
        }
      `}</style>

    </>
  );
};
export default ProductCardSM;
