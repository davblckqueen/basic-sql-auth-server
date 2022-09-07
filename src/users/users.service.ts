import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Quote) private readonly repo: Repository<Quote>,
        @Inject(forwardRef(() => PricingService))
        private readonly pricingService: PricingService,
    ) {}
}
