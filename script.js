/* ============================================================
   app.js — Miho Takahashi | Creative Shop
   Alpine.js アプリケーションロジック
   ============================================================ */


/**
 * shopApp()
 * Alpine.js の x-data に渡すアプリケーション本体。
 * 状態管理・カート操作・購入処理をすべてここで定義する。
 */
function shopApp() {
    return {

        /* ---------- 状態 ---------- */

        scrolled:       false,   // ナビのスクロール検知
        cartOpen:       false,   // カートパネルの開閉
        mobileMenuOpen: false,   // モバイルメニューの開閉
        detailOpen:     false,   // 商品詳細モーダルの開閉
        selectedItem:   null,    // 詳細表示中の商品
        purchaseStep:   'cart',  // 'cart' | 'complete'
        isProcessing:   false,   // チェックアウト処理中フラグ
        cart:           [],      // カートアイテム配列


        /* ---------- 商品データ ---------- */

        products: [
            {
                id:          '01',
                title:       'Art Mag Cup',
                price:       2500,
                img:         'mag.png',
                description: '朝のコーヒータイムを彩る、色彩豊かなオリジナルマグカップです。'
            },
            {
                id:          '02',
                title:       'Canvas Art Print',
                price:       3200,
                img:         'kaiga.png',
                description: '高品質なキャンバスにジークレープリントを施した一点。'
            },
            {
                id:          '03',
                title:       'Design Cushion',
                price:       2500,
                img:         'cusion.png',
                description: '手触りの良い素材に、ダイナミックなグラフィックをプリント。'
            },
            {
                id:          '04',
                title:       'Artist T-shirt',
                price:       4800,
                img:         'shirt.png',
                description: '日常にアートを纏う。上質なコットンを使用した一枚。'
            },
        ],


        /* ---------- 算出プロパティ ---------- */

        /** カート内の合計個数 */
        get cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },

        /** カート内の合計金額 */
        get total() {
            return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },


        /* ---------- メソッド ---------- */

        /**
         * 商品詳細モーダルを開く
         * @param {Object} item - 選択した商品オブジェクト
         */
        openDetail(item) {
            this.selectedItem = item;
            this.detailOpen   = true;
            setTimeout(() => lucide.createIcons(), 100);
        },

        /**
         * 商品をカートに追加する
         * すでに同じ商品があれば数量を +1 する
         * @param {Object} product - 追加する商品オブジェクト
         */
        addToCart(product) {
            const existing = this.cart.find(i => i.id === product.id);

            if (existing) {
                existing.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }

            // カートパネルを開く
            this.cartOpen      = true;
            this.purchaseStep  = 'cart';
            setTimeout(() => lucide.createIcons(), 100);
        },

        /**
         * カートから商品を削除する
         * @param {string} id - 削除する商品の ID
         */
        removeFromCart(id) {
            this.cart = this.cart.filter(i => i.id !== id);
        },

        /**
         * チェックアウト処理（モック）
         * 1秒後に購入完了画面へ遷移し、カートをクリアする
         */
        processPurchase() {
            this.isProcessing = true;

            setTimeout(() => {
                this.isProcessing  = false;
                this.purchaseStep  = 'complete';
                this.cart          = [];
                setTimeout(() => lucide.createIcons(), 100);
            }, 1000);
        },


        /* ---------- 初期化 ---------- */

        /** Alpine.js 初期化時に Lucide アイコンを描画 */
        init() {
            lucide.createIcons();
            setTimeout(() => lucide.createIcons(), 100);
        }

    };
}
