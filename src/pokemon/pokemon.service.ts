import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePuntuationDto } from './dto/create-puntuation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    private readonly httpService: HttpService) { }

  async getOne(name: string): Promise<Pokemon> {
    const response = await lastValueFrom(this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${name}`));
    return response.data;
  }

  async getAll(offset: number, limit: number): Promise<Pokemon[]> {
    const response = await lastValueFrom(this.httpService.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`));
    return response.data.results;
  }

  async createPuntuation(createPuntuationDto: CreatePuntuationDto): Promise<Pokemon> {
    const { id, puntuation } = createPuntuationDto;

    let pokemon = await this.pokemonRepository.findOne({ where: { id } });

    if (!pokemon) {
      const response = await lastValueFrom(
        this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      );

      if (!response.data) {
        throw new NotFoundException(`Pokemon with id ${id} not found`);
      }
      pokemon = this.pokemonRepository.create({
        id,
        name: response.data.name,
      });
    }
    pokemon.puntuation = puntuation;
    if (puntuation > 5) {
      throw new NotFoundException('the value must be from 1 to 5');
    }
    await this.pokemonRepository.save(pokemon);

    return pokemon;
  }

  async getPokemons(name: string, ope: string, baseExperience: number): Promise<Pokemon[]> {
    const query = this.pokemonRepository.createQueryBuilder('pokemon');
  
    if (name) {
      query.andWhere('LOWER(pokemon.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }
    if (baseExperience && ope) {
      switch (ope) {
        case 'gt':
          query.andWhere('pokemon.base_experience > :baseExperience', { baseExperience });
          break;
        case 'lt':
          query.andWhere('pokemon.base_experience < :baseExperience', { baseExperience });
          break;
        case 'ge':
          query.andWhere('pokemon.base_experience >= :baseExperience', { baseExperience });
          break;
        case 'le':
          query.andWhere('pokemon.base_experience <= :baseExperience', { baseExperience });
          break;
        case 'eq':
          query.andWhere('pokemon.base_experience = :baseExperience', { baseExperience });
          break;
        default:
          throw new Error('Invalid operator');
      }
    }
  
    // Devuelve los resultados de la consulta
    return await query.getMany();
  }
}