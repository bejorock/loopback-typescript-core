import { KeyValueModel, KeyValueDao } from '../main/models/key-value.model';
import { CommonModel } from '../main/models/decorators';
import { injectable } from 'inversify';

@injectable()
export class TokenDao extends KeyValueDao
{
	ModelClass = TokenModel
}

@injectable()
@CommonModel({
	base: 'KeyValueModel',
	dao: TokenDao,
	dataSource: 'redisDb'
})
export class TokenModel extends KeyValueModel
{

}