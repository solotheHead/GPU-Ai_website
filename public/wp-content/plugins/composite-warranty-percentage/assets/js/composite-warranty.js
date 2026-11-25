;( function ( $, window, document, undefined ) {
	'use strict';

	if ( typeof window.WCPWSettings === 'undefined' ) {
		return;
	}

	var settings = window.WCPWSettings;

	function asNumber( value ) {
		var parsed = parseFloat( value );
		return isFinite( parsed ) ? parsed : null;
	}

	function findTotal( totals ) {
		if ( ! totals || typeof totals !== 'object' ) {
			return null;
		}

		var preferredKeys = [
			'price',
			'price_incl_tax',
			'price_excl_tax',
			'regular_price'
		];

		for ( var i = 0; i < preferredKeys.length; i++ ) {
			if ( Object.prototype.hasOwnProperty.call( totals, preferredKeys[ i ] ) ) {
				var preferred = asNumber( totals[ preferredKeys[ i ] ] );

				if ( preferred !== null ) {
					return preferred;
				}
			}
		}

		for ( var key in totals ) {
			if ( ! Object.prototype.hasOwnProperty.call( totals, key ) ) {
				continue;
			}

			if ( /price|total/i.test( key ) ) {
				var fallback = asNumber( totals[ key ] );

				if ( fallback !== null ) {
					return fallback;
				}
			}
		}

		return null;
	}

	function numberFormat( amount ) {
		var decimals = parseInt( settings.decimals, 10 );

		if ( ! isFinite( decimals ) ) {
			decimals = 2;
		}

		var fixed = Number( amount ).toFixed( decimals );
		var parts = fixed.split( '.' );
		var integer = parts[ 0 ];
		var decimalPart = parts.length > 1 ? parts[ 1 ] : '';

		integer = integer.replace(
			/\B(?=(\d{3})+(?!\d))/g,
			String( settings.thousandSeparator || ',' )
		);

		return decimalPart
			? integer + String( settings.decimalSeparator || '.' ) + decimalPart
			: integer;
	}

	function moneyHtml( amount ) {
		var symbol = String( settings.currencySymbol || '$' );
		var number = numberFormat( amount );
		var format = String( settings.priceFormat || '%1$s%2$s' );

		var inner = format
			.replace(
				'%1$s',
				'<span class="woocommerce-Price-currencySymbol">' +
					symbol +
				'</span>'
			)
			.replace( '%2$s', number );

		return (
			'<span class="woocommerce-Price-amount amount"><bdi>' +
				inner +
			'</bdi></span>'
		);
	}

	function moneyText( amount ) {
		var symbol = String( settings.currencySymbol || '$' );
		var number = numberFormat( amount );
		var format = String( settings.priceFormat || '%1$s%2$s' );

		return format
			.replace( '%1$s', symbol )
			.replace( '%2$s', number );
	}

	$( '.composite_data' ).on(
		'wc-composite-initializing',
		function ( event, composite ) {
			var $root = $( this );

			var controller = {
				isWarrantySelected: function () {
					var configuration = composite.api.get_composite_configuration() || {};
					var warrantyProductId = String( settings.warrantyProductId );

					for ( var componentId in configuration ) {
						if (
							Object.prototype.hasOwnProperty.call( configuration, componentId ) &&
							String( configuration[ componentId ].product_id || '' ) === warrantyProductId
						) {
							return true;
						}
					}

					return false;
				},

				getNativePrice: function () {
					return $root.find( '.composite_price' ).first();
				},

				getCustomPrice: function () {
					var $custom = $root.find( '.wcpw-live-total' );

					if ( ! $custom.length ) {
						$custom = $( '<div class="wcpw-live-total" aria-live="polite"></div>' );

						var $native = this.getNativePrice();

						if ( $native.length ) {
							$custom.insertAfter( $native );
						} else {
							$root.find( '.composite_wrap' ).append( $custom );
						}
					}

					return $custom;
				},

				render: function () {
					var $native = this.getNativePrice();
					var $custom = this.getCustomPrice();

					if ( ! this.isWarrantySelected() ) {
						$native.show().removeAttr( 'aria-hidden' );
						$custom.hide();
						return;
					}

					var totals = composite.api.get_composite_totals();
					var baseTotal = findTotal( totals );

					if ( baseTotal === null ) {
						$native.show().removeAttr( 'aria-hidden' );
						$custom.hide();
						return;
					}

					var warrantyAmount = baseTotal * parseFloat( settings.rate );
					var finalTotal = baseTotal + warrantyAmount;

					$custom.html(
						'<div class="wcpw-live-total__price">' +
							moneyHtml( finalTotal ) +
						'</div>' +
						'<div class="wcpw-live-total__fee">' +
							'<strong>' + String( settings.label ) + ':</strong> +' +
							moneyText( warrantyAmount ) +
						'</div>'
					);

					$native.hide().attr( 'aria-hidden', 'true' );
					$custom.show();
				}
			};

			composite.actions.add_action(
				'composite_initialized',
				controller.render,
				1000,
				controller
			);

			composite.actions.add_action(
				'composite_totals_changed',
				controller.render,
				1000,
				controller
			);

			composite.actions.add_action(
				'component_selection_changed',
				controller.render,
				1000,
				controller
			);
		}
	);

} )( jQuery, window, document );
