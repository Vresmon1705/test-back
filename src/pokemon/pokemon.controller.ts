import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePuntuationDto } from './dto/create-puntuation.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get(':name')
  async getOne(@Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.getOne(name);
  }

  @Get()
  async getAll(@Query('offset') offset, @Query('limit') limit): Promise<Pokemon[]> {
    return this.pokemonService.getAll(offset, limit);
  }
  
  @Post('create')
  async createPuntuation(@Body() createPuntuationDto: CreatePuntuationDto): Promise<Pokemon> {
    return this.pokemonService.createPuntuation(createPuntuationDto);
  }

  @Get('filter')
  async getPokemons(
    @Query('name') name: string,
    @Query('ope') ope: string,
    @Query('base_ezperience') base_experience: number
  ): Promise<Pokemon[]> {
    return this.pokemonService.getPokemons(name, ope, base_experience);
  }
  
}