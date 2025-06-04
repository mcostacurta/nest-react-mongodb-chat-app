import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { User } from "../users/entities/user.entity";

const getCurrrentUserByContext = (context: ExecutionContext): User => {
    if (context.getType<GqlContextType>() === 'graphql'){
        return GqlExecutionContext.create(context).getContext().req.user;
    }
    return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => 
        getCurrrentUserByContext(context),
)