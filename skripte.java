		Map<String, ScriptPubKey> scriptTypes = new HashMap<String, ScriptPubKey>();
				
		int cnt = 0;
		
		for (String txId : client.getRawMemPool()) {
		
			System.out.println("Parsing scripts from mempool transaction #" + cnt++);
			
			try {
				for (Out out : client.getRawTransaction(txId).vOut()) {
					
					ScriptPubKey scr = out.scriptPubKey();
					scriptTypes.put(scr.type(), scr);
				}
			} catch (GenericRpcException e) { // ignore RPC errors
			}
			
			if(cnt>=100)
				break;
		}
		
		System.out.println();
		System.out.println("*** POPIS SKRIPTI ***");
				
		for (String type : scriptTypes.keySet()) {
			
			System.out.println();
			System.out.println("Vrsta skripte: " + type);
			System.out.println("Detalji:       " + scriptTypes.get(type));
		}