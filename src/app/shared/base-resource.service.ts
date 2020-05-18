import { Injector, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// services
import { BaseService } from './base.service';
import { BaseResourceModel } from '../model/base-resource.model';


export abstract class BaseResourceService<T extends BaseResourceModel> extends BaseService {
	protected http: HttpClient;
	public clearForm$: EventEmitter<boolean> = new EventEmitter();
	public updateFormValues$: EventEmitter<object> = new EventEmitter();
	public clearVariables$: EventEmitter<boolean> = new EventEmitter();

	constructor(
		protected apiPath: string,
		public injector: Injector
	) {
		super(injector);
		this.http = this.injector.get(HttpClient);
	}

	public getAll(): Observable<T[]> {
		return this.http
			.get(`${this.url}/${this.apiPath}`, super.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(this.mapsError)
			);
	}

	// public getAllPageable(pageParams: string, bodyParams?: object): Observable<DefaultListModel<T>> {
	// 	return this.http
	// 		.post(`${this.url}/${this.apiPath}/list${pageParams || ''}`, bodyParams, {
	// 			headers: this.getHeader()
	// 		})
	// 		.pipe(
	// 			map(this.extractData),
	// 			catchError(this.mapsError)
	// 		);
	// }

	public getById(id: string): Observable<T> {
		return this.http
			.get(`${this.url}/${this.apiPath}?id=${id}`, super.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(this.mapsError)
			);
	}

	public getGenericList(serviceUrl: string): Observable<any> {
		return this.http
			.get(`${this.url}/${serviceUrl}`, super.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(erro => throwError(erro.error.message))
			);
	}

	public create(resource: T): Observable<T> {
		return this.http
			.post(`${this.url}/${this.apiPath}`, resource, super.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(this.mapsError)
			);
	}

	public update(resource: T): Observable<T> {
		return this.http
			.put(`${this.url}/${this.apiPath}`, resource, super.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(this.mapsError)
			);
	}

	public delete(id: string | number): Observable<any> {
		return this.http
			.delete(`${this.url}/${this.apiPath}/${id}`, super.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(this.mapsError)
			);
	}

	public genericGet(route: string): Observable<any> {
		return this.http
			.get(`${this.url}/${route}`, this.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(this.mapsError)
			);
	}

	public genericPost(params: T): Observable<T> {
		return this.http
			.post(`${this.url}/${this.apiPath}`, params, this.httpJsonAuth())
			.pipe(
				map(this.extractData),
				catchError(this.mapsError)
			);
	}

	protected extractData(response: T) {
		return response || {};
	}

	protected mapsError(error: any): Observable<any> {
		return throwError(error);
	}

	public clearForm() {
		this.clearForm$.emit(true);
	}

	public updateFormValues(values: object) {
		this.updateFormValues$.emit(values);
	}

	public clearVariables() {
		this.clearVariables$.emit(true);
	}
}
