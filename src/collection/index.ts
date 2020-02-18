import HegemonyStandard from './hegemony-standard';
import Maneuvering from './maneuvering';
import Standard from './standard';

const collections = new Map();
collections.set('standard', new Standard());
collections.set('maneuvering', new Maneuvering());
collections.set('hegemony-standard', new HegemonyStandard());

export default collections;
