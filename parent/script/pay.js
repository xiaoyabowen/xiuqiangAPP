
function pay(payType,params,url,callback){
	if(payType == "alipay"){
		aliPay(params,url,callback);
	} else if (payType == 1) {
		weixinPay(params,callback);
	}
}


function weixinPay(params,callback){
	api.showProgress({});
	ajaxGet(orderPayParam,params,function(ret,err){
//		alert(JSON.stringify(ret));
//		alert(JSON.stringify(err));
		if(ret){
			var wxPay = api.require('wxPay');
//			alert(JSON.stringify(ret.data));
			
			var wxOrderId = ret.prepayid;
			var mchId = ret.partnerid;
			var nonce_str = ret.noncestr;
			var sign = ret.sign;
			var timeStamp = ret.timestamp;
			var wxPackage = ret.package;
			
			wxPay.payOrder({
				orderId: wxOrderId,
				mchId: mchId,
				nonceStr: nonce_str,
				timeStamp: timeStamp,
				package : wxPackage,
				sign: sign
			}, function(ret, err){
				api.hideProgress();
				if(ret.status == true){
					//支付成功
//					api.toast({
//				    		msg : '支付成功！'
//			        });
			        var btnArray = ['好的'];
					mui.confirm('支付成功', '提示',btnArray, function(e) {
						if (e.index == 0) {
		            		api.execScript({
						        name: "userInfo",
						        script: 'reloadHtml()'
						    });
			            	closeWin();
		            	}
		           })
					callback(ret);
				}else{
					api.toast({
				    		msg : '支付失败！请稍候再试！'
			        });
				}
			});	
		} else {
			api.hideProgress();
			api.toast({
	        		msg : ret.errorMessage
            });
		}
	});	
}


function aliPay(params,url,callback){
	api.showProgress({});
	ajaxGet(url,params,function(ret,err){
		api.hideProgress();
		if(ret){
			var obj = api.require('aliPay');
			var orderInfo = ret.data;
			obj.payOrder({
				orderInfo : orderInfo
			},function(ret,err) {
				if(ret.code == 9000){
					callback(ret);
				}else{
					api.toast({
	                		msg : '支付失败！请稍候再试！'
                    });
				}
			});
		} else {
			api.toast({
	        		msg : ret.errorMessage
            });
		}
	});
}