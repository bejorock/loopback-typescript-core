import { CommonModule } from '../src/main/models/decorators';
import Module from '../src/main/boot/module';
import path from 'path';

@CommonModule({})
class BootAppModule extends Module{}

@CommonModule({})
class ChildAppModule extends Module{}

@CommonModule({})
class Child2AppModule extends Module{}

@CommonModule({
	imports: [ChildAppModule, Child2AppModule]
})
class RootAppModule extends Module{}

describe('boot app', () => {
	
	it("single module", async () => {
		Module.boot(BootAppModule, path.resolve(__dirname, '../src/resources')).then(module => {
			expect(module instanceof BootAppModule).toBe(true)
		})
	})

	it("hierarcy module", async () => {
		Module.boot(RootAppModule, path.resolve(__dirname, '../src/resources')).then(module => {
			expect(module instanceof RootAppModule).toBe(true)
		})
	})

});
