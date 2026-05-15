import React, { createContext, useContext, useState } from 'react';

const PC = createContext();
export const useProducts = () => useContext(PC);

const MASTER = [
  {_id:'1',name:'Fresh Tomato',nameHindi:'ताज़ा टमाटर',quantity:'1 kg',unit:'kg',price:35,mrp:45,stock:100,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop','https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop'],description:'Fresh red tomatoes sourced daily from local farms.'},
  {_id:'2',name:'Green Spinach',nameHindi:'हरी पालक',quantity:'250 g',unit:'g',price:20,mrp:28,stock:80,category:'vegetables',badge:'Organic',img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'],description:'Fresh organic spinach.'},
  {_id:'3',name:'Fresh Onion',nameHindi:'ताज़ा प्याज',quantity:'1 kg',unit:'kg',price:28,mrp:35,stock:150,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=300&fit=crop'],description:'Fresh onions from Kalpi region.'},
  {_id:'4',name:'Potato',nameHindi:'आलू',quantity:'1 kg',unit:'kg',price:25,mrp:32,stock:200,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop'],description:'Fresh potatoes, good for sabzi and frying.'},
  {_id:'5',name:'Green Chilli',nameHindi:'हरी मिर्च',quantity:'100 g',unit:'g',price:15,mrp:22,stock:60,category:'vegetables',badge:'Hot',img:'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=400&h=300&fit=crop'],description:'Fresh hot green chillies.'},
  {_id:'6',name:'Cauliflower',nameHindi:'गोभी',quantity:'1 piece',unit:'pcs',price:30,mrp:40,stock:45,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=400&h=300&fit=crop'],description:'Fresh white cauliflower.'},
  {_id:'7',name:'Carrot',nameHindi:'गाजर',quantity:'500 g',unit:'g',price:22,mrp:30,stock:70,category:'vegetables',badge:'Fresh',img:'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300&fit=crop'],description:'Sweet and crunchy carrots.'},
  {_id:'8',name:'Cucumber',nameHindi:'खीरा',quantity:'500 g',unit:'g',price:18,mrp:25,stock:80,category:'vegetables',badge:'Cool',img:'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop'],description:'Fresh cucumbers, great for salad.'},
  {_id:'9',name:'Fresh Banana',nameHindi:'केला',quantity:'12 pcs',unit:'pcs',price:48,mrp:60,stock:90,category:'fruits',badge:'Ripe',img:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop'],description:'Ripe sweet bananas, fresh from farm.'},
  {_id:'10',name:'Red Apple',nameHindi:'सेब',quantity:'4 pcs',unit:'pcs',price:80,mrp:100,stock:50,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop'],description:'Fresh red apples, crispy and sweet.'},
  {_id:'11',name:'Sweet Orange',nameHindi:'संतरा',quantity:'4 pcs',unit:'pcs',price:60,mrp:75,stock:60,category:'fruits',badge:'Juicy',img:'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop'],description:'Juicy sweet oranges.'},
  {_id:'12',name:'Watermelon',nameHindi:'तरबूज',quantity:'1 piece',unit:'pcs',price:65,mrp:80,stock:20,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&h=300&fit=crop'],description:'Big fresh watermelon.'},
  {_id:'13',name:'Mango',nameHindi:'आम',quantity:'1 kg',unit:'kg',price:90,mrp:120,stock:40,category:'fruits',badge:'Season',img:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop'],description:'Seasonal Alphonso mangoes.'},
  {_id:'14',name:'Papaya',nameHindi:'पपीता',quantity:'1 piece',unit:'pcs',price:55,mrp:70,stock:35,category:'fruits',badge:'Fresh',img:'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop'],description:'Sweet ripe papaya.'},
  {_id:'15',name:'Full Cream Milk',nameHindi:'दूध',quantity:'500 ml',unit:'ml',price:29,mrp:32,stock:120,category:'dairy',badge:'Daily',img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop'],description:'Pure full cream milk.'},
  {_id:'16',name:'Fresh Curd',nameHindi:'दही',quantity:'400 g',unit:'g',price:35,mrp:45,stock:80,category:'dairy',badge:'Fresh',img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'],description:'Thick fresh curd made from pure milk.'},
  {_id:'17',name:'Paneer',nameHindi:'पनीर',quantity:'200 g',unit:'g',price:75,mrp:95,stock:30,category:'dairy',badge:'Fresh',img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop'],description:'Soft fresh paneer made daily.'},
  {_id:'18',name:'Butter',nameHindi:'मक्खन',quantity:'100 g',unit:'g',price:55,mrp:70,stock:25,category:'dairy',badge:'Pure',img:'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop'],description:'Pure white butter.'},
  {_id:'19',name:'Farm Eggs',nameHindi:'अंडे',quantity:'6 pcs',unit:'pcs',price:36,mrp:48,stock:100,category:'dairy',badge:'Farm',img:'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop'],description:'Fresh farm eggs, daily collection.'},
  {_id:'20',name:'Basmati Rice',nameHindi:'बासमती चावल',quantity:'1 kg',unit:'kg',price:85,mrp:110,stock:50,category:'grains',badge:'Premium',img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1536304993881-ff86e0c9e90b?w=400&h=300&fit=crop'],description:'Premium long grain basmati rice.'},
  {_id:'21',name:'Toor Dal',nameHindi:'तूर दाल',quantity:'500 g',unit:'g',price:60,mrp:75,stock:60,category:'grains',badge:'Fresh',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=400&h=300&fit=crop'],description:'Pure toor dal for daily cooking.'},
  {_id:'22',name:'Chana Dal',nameHindi:'चना दाल',quantity:'500 g',unit:'g',price:55,mrp:70,stock:55,category:'grains',badge:'Pure',img:'https://images.unsplash.com/photo-1609501676725-7186f017a4b4?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1609501676725-7186f017a4b4?w=400&h=300&fit=crop'],description:'Clean pure chana dal.'},
  {_id:'23',name:'Wheat Atta',nameHindi:'गेहूं का आटा',quantity:'5 kg',unit:'kg',price:220,mrp:260,stock:40,category:'grains',badge:'Best',img:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'],description:'Whole wheat atta, freshly milled.'},
  {_id:'24',name:'Moong Dal',nameHindi:'मूंग दाल',quantity:'500 g',unit:'g',price:65,mrp:80,stock:45,category:'grains',badge:'Fresh',img:'https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1585996741680-d1a9a3e1c8d5?w=400&h=300&fit=crop'],description:'Split moong dal.'},
  {_id:'25',name:'Sugar',nameHindi:'चीनी',quantity:'1 kg',unit:'kg',price:45,mrp:55,stock:80,category:'grains',badge:'Pure',img:'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&h=300&fit=crop'],description:'Pure white sugar.'},
  {_id:'26',name:'Poha',nameHindi:'पोहा',quantity:'500 g',unit:'g',price:30,mrp:40,stock:60,category:'grains',badge:'Light',img:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop'],description:'Light flattened rice poha.'},
  {_id:'27',name:'Sunflower Oil',nameHindi:'सूरजमुखी तेल',quantity:'1 litre',unit:'litre',price:145,mrp:175,stock:45,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'],description:'Pure sunflower cooking oil.'},
  {_id:'28',name:'Mustard Oil',nameHindi:'सरसों का तेल',quantity:'1 litre',unit:'litre',price:160,mrp:190,stock:40,category:'oil',badge:'Kachi Ghani',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'],description:'Kachi ghani mustard oil.'},
  {_id:'29',name:'Turmeric Powder',nameHindi:'हल्दी',quantity:'100 g',unit:'g',price:28,mrp:40,stock:70,category:'oil',badge:'Pure',img:'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop'],description:'Pure turmeric powder.'},
  {_id:'30',name:'Red Chilli Powder',nameHindi:'लाल मिर्च',quantity:'100 g',unit:'g',price:32,mrp:45,stock:65,category:'oil',badge:'Spicy',img:'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=400&h=300&fit=crop'],description:'Hot red chilli powder.'},
  {_id:'31',name:'Garam Masala',nameHindi:'गरम मसाला',quantity:'50 g',unit:'g',price:35,mrp:50,stock:55,category:'oil',badge:'Blend',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'],description:'Mixed spice blend garam masala.'},
  {_id:'32',name:'Salt',nameHindi:'नमक',quantity:'1 kg',unit:'kg',price:22,mrp:28,stock:90,category:'oil',badge:'Iodised',img:'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=300&fit=crop'],description:'Iodised table salt.'},
  {_id:'33',name:'Coriander Powder',nameHindi:'धनिया पाउडर',quantity:'100 g',unit:'g',price:22,mrp:32,stock:60,category:'oil',badge:'Fresh',img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop'],description:'Fresh coriander powder.'},
  {_id:'34',name:'Parle-G Biscuits',nameHindi:'बिस्किट',quantity:'800 g',unit:'g',price:50,mrp:60,stock:80,category:'snacks',badge:'Popular',img:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'],description:'Classic glucose biscuits.'},
  {_id:'35',name:'Namkeen Mix',nameHindi:'नमकीन',quantity:'200 g',unit:'g',price:30,mrp:40,stock:70,category:'snacks',badge:'Crispy',img:'https://images.unsplash.com/photo-1575367439058-6096bb43d5d3?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1575367439058-6096bb43d5d3?w=400&h=300&fit=crop'],description:'Crispy mixed namkeen.'},
  {_id:'36',name:'Potato Chips',nameHindi:'चिप्स',quantity:'100 g',unit:'g',price:20,mrp:30,stock:90,category:'snacks',badge:'Crunchy',img:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop'],description:'Crunchy salted potato chips.'},
  {_id:'37',name:'Maggi Noodles',nameHindi:'मैगी',quantity:'4 pack',unit:'pcs',price:56,mrp:68,stock:75,category:'snacks',badge:'Quick',img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop'],description:'Quick 2-minute noodles.'},
  {_id:'38',name:'Brown Bread',nameHindi:'ब्रेड',quantity:'400 g',unit:'g',price:42,mrp:55,stock:40,category:'snacks',badge:'Fresh',img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'],description:'Fresh baked brown bread.'},
  {_id:'39',name:'Roasted Peanuts',nameHindi:'मूंगफली',quantity:'200 g',unit:'g',price:25,mrp:35,stock:85,category:'snacks',badge:'Protein',img:'https://images.unsplash.com/photo-1567892737950-30b3c38ae5e0?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1567892737950-30b3c38ae5e0?w=400&h=300&fit=crop'],description:'Roasted salted peanuts.'},
  {_id:'40',name:'Coca Cola',nameHindi:'कोका कोला',quantity:'750 ml',unit:'ml',price:40,mrp:50,stock:60,category:'drinks',badge:'Cold',img:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop'],description:'Chilled Coca Cola bottle.'},
  {_id:'41',name:'Sprite',nameHindi:'स्प्राइट',quantity:'750 ml',unit:'ml',price:40,mrp:50,stock:55,category:'drinks',badge:'Fresh',img:'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&h=300&fit=crop'],description:'Fresh lime Sprite.'},
  {_id:'42',name:'Mango Juice',nameHindi:'आम का जूस',quantity:'200 ml',unit:'ml',price:20,mrp:28,stock:70,category:'drinks',badge:'Fruity',img:'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop'],description:'Real mango juice.'},
  {_id:'43',name:'Mineral Water',nameHindi:'पानी',quantity:'1 litre',unit:'litre',price:20,mrp:25,stock:100,category:'drinks',badge:'Pure',img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop'],description:'Pure mineral drinking water.'},
  {_id:'44',name:'Lassi',nameHindi:'लस्सी',quantity:'200 ml',unit:'ml',price:25,mrp:35,stock:40,category:'drinks',badge:'Fresh',img:'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=300&fit=crop'],description:'Sweet cold lassi.'},
  {_id:'45',name:'Dettol Soap',nameHindi:'साबुन',quantity:'75 g',unit:'g',price:38,mrp:50,stock:60,category:'household',badge:'Protect',img:'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=300&fit=crop'],description:'Antibacterial protection soap.'},
  {_id:'46',name:'Surf Excel',nameHindi:'सर्फ एक्सेल',quantity:'500 g',unit:'g',price:85,mrp:105,stock:45,category:'household',badge:'Clean',img:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop'],description:'Surf Excel washing powder.'},
  {_id:'47',name:'Colgate Toothpaste',nameHindi:'टूथपेस्ट',quantity:'150 g',unit:'g',price:65,mrp:85,stock:50,category:'household',badge:'Care',img:'https://images.unsplash.com/photo-1559591939-0e0e3e8b8a2d?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1559591939-0e0e3e8b8a2d?w=400&h=300&fit=crop'],description:'Colgate strong teeth toothpaste.'},
  {_id:'48',name:'Dish Wash Bar',nameHindi:'बर्तन साबुन',quantity:'200 g',unit:'g',price:20,mrp:28,stock:70,category:'household',badge:'Clean',img:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop'],description:'Bar for cleaning dishes.'},
  {_id:'49',name:'Agarbatti',nameHindi:'अगरबत्ती',quantity:'20 sticks',unit:'pcs',price:15,mrp:22,stock:80,category:'household',badge:'Fragrant',img:'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'],description:'Fragrant incense sticks.'},
  {_id:'50',name:'Match Box',nameHindi:'माचिस',quantity:'1 box',unit:'pcs',price:5,mrp:8,stock:120,category:'household',badge:'Daily',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],description:'Safety match box.'},
];

const load = (key, def) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => load('apnidukan_products', MASTER));
  const [ratings, setRatings] = useState(() => load('apnidukan_ratings', []));
  const [blockedUsers, setBlockedUsers] = useState(() => load('apnidukan_blocked', []));
  const [referrals, setReferrals] = useState(() => load('apnidukan_referrals', []));
  const [notifications, setNotifications] = useState(() => load('apnidukan_notifications', []));

  const saveProducts = v => { setProducts(v); save('apnidukan_products', v); };
  const saveRatings = v => { setRatings(v); save('apnidukan_ratings', v); };
  const saveBlocked = v => { setBlockedUsers(v); save('apnidukan_blocked', v); };
  const saveReferrals = v => { setReferrals(v); save('apnidukan_referrals', v); };
  const saveNotifications = v => { setNotifications(v); save('apnidukan_notifications', v); };

  const updateProduct = (id, updates) => saveProducts(products.map(p => p._id === id ? { ...p, ...updates } : p));
  const addProduct = p => saveProducts([...products, { ...p, _id: String(Date.now()) }]);
  const deleteProduct = id => saveProducts(products.filter(p => p._id !== id));

  const addRating = r => saveRatings([...ratings, { ...r, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() }]);
  const approveRating = id => saveRatings(ratings.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  const rejectRating = id => saveRatings(ratings.map(r => r.id === id ? { ...r, status: 'rejected' } : r));

  const blockUser = user => saveBlocked([...blockedUsers.filter(b => b.email !== user.email), { ...user, blockedAt: new Date().toISOString() }]);
  const unblockUser = email => saveBlocked(blockedUsers.filter(b => b.email !== email));
  const isBlocked = (email, phone) => blockedUsers.some(b => b.email === email || (phone && b.phone === phone));

  // Referral: unique code per user, reward after first order
  const generateReferralCode = name => {
    const allCodes = referrals.map(r => r.code);
    let code;
    do {
      const clean = (name || 'USER').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4).padEnd(4, 'X');
      code = clean + Math.floor(1000 + Math.random() * 9000);
    } while (allCodes.includes(code));
    return code;
  };

  const registerReferralCode = (code, ownerEmail) => {
    if (!referrals.find(r => r.code === code)) {
      saveReferrals([...referrals, { code, ownerEmail, usedBy: null, rewarded: false, createdAt: new Date().toISOString() }]);
    }
  };

  const applyReferral = (code, newUserEmail) => {
    const ref = referrals.find(r => r.code === code && !r.usedBy && r.ownerEmail !== newUserEmail);
    if (!ref) return false;
    saveReferrals(referrals.map(r => r.code === code ? { ...r, usedBy: newUserEmail, usedAt: new Date().toISOString() } : r));
    return true;
  };

  // Called when first order is delivered — reward the referral code owner
  const rewardReferral = (userEmail) => {
    const ref = referrals.find(r => r.usedBy === userEmail && !r.rewarded);
    if (!ref) return null;
    saveReferrals(referrals.map(r => r.usedBy === userEmail && !r.rewarded ? { ...r, rewarded: true, rewardedAt: new Date().toISOString() } : r));
    return ref.ownerEmail; // return owner email to add wallet credit
  };

  const sendNotification = (msg, type = 'info') => {
    saveNotifications([{ id: Date.now(), message: msg, type, createdAt: new Date().toISOString(), readBy: [] }, ...notifications]);
  };

  const markNotifRead = (notifId, userEmail) => {
    saveNotifications(notifications.map(n => n.id === notifId ? { ...n, readBy: [...(n.readBy || []), userEmail] } : n));
  };

  const approvedRatings = ratings.filter(r => r.status === 'approved');

  return (
    <PC.Provider value={{
      products, updateProduct, addProduct, deleteProduct, MASTER,
      ratings, approvedRatings, addRating, approveRating, rejectRating,
      blockedUsers, blockUser, unblockUser, isBlocked,
      referrals, generateReferralCode, registerReferralCode, applyReferral, rewardReferral,
      notifications, sendNotification, markNotifRead,
    }}>
      {children}
    </PC.Provider>
  );
};