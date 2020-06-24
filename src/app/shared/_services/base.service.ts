import { Injector } from '@angular/core';

// class
import { environment } from 'src/environments/environment';

// services
import { HttpHeaders } from '@angular/common/http';

export abstract class BaseService {

	protected url = environment.url;

	constructor(
		public injector: Injector
	) { }

	protected httpJsonAuth() {
		return {
			headers: this.getHeader()
		};
	}

	protected getHeader() {
		return new HttpHeaders({
			'Content-Type': 'application/json'
		});
	}
}
