import { RxStompConfig} from '@stomp/rx-stomp';
import { environment } from '../../../environments/environment';
const token = localStorage.getItem('token');
export const rxStompConfig : RxStompConfig  = {
   brokerURL: environment.baseBrokerUrl,
   connectHeaders: {
    Authorization: `Bearer ${token}`
   },
   heartbeatIncoming: 0,
   heartbeatOutgoing: 20000,
   reconnectDelay: 200,
   debug: (msg: string): void => {
     console.log(new Date(), msg);
   }
}
console.log(rxStompConfig);
