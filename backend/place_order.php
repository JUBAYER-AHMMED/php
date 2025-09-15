<?php
declare(strict_types=1);
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$d = json_decode(file_get_contents('php://input'), true) ?: [];
$n=trim($d['customerName']??''); 
$e=trim($d['customerEmail']??''); 
$a=trim($d['customerAddress']??''); 
$p=trim($d['paymentMethod']??''); 
$c=$d['cartItems']??[];

if(!$n||!$e||!$a||!$c){ echo json_encode(['success'=>false,'message'=>'All fields are required']); exit; }

$t=0; foreach($c as $i) $t+=$i['price']*$i['quantity'];

try{
  $pdo->prepare("INSERT INTO orders (customer_name,email,address,payment_method,total_amount,cart_items,created_at)
                 VALUES(:n,:e,:a,:p,:t,:c,NOW())")
      ->execute([':n'=>$n,':e'=>$e,':a'=>$a,':p'=>$p,':t'=>$t,':c'=>json_encode($c)]);
  echo json_encode(['success'=>true,'total'=>$t]);
}catch(Exception $ex){
  echo json_encode(['success'=>false,'message'=>'Database error']);
}
