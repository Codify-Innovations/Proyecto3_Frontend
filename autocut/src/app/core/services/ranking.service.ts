import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IRankingUser, IResponse } from '../interfaces';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root',
})
export class RankingService extends BaseService<IRankingUser> {

    protected override source: string = 'api/ranking';

    getTopUsers(): Observable<IResponse<IRankingUser[]>> {
        return this.http.get<IResponse<IRankingUser[]>>(`${this.source}/top`);
    }
}

